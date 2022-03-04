import { ActionKinds, BusinesLogicStateMachine, States, WaitFor } from './businesLogic.stateMachine'

describe('it runs a test', () => {
  it('defaults to initial waiting state', () => {
    const sm = new BusinesLogicStateMachine()
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.NotConfirmable)
    expect(state.waitingFor).toContain(WaitFor.ProxyAddress)
    expect(state.waitingFor).toContain(WaitFor.DepositAmount)
    expect(state.waitingFor).toContain(WaitFor.ConversionRate)
  })

  it('remains in waiting state when given a deposit amount', async () => {
    const sm = new BusinesLogicStateMachine()
    await sm.transition({ kind: ActionKinds.DepositAmount, amount: 100 })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.NotConfirmable)
    expect(state.waitingFor).not.toContain(WaitFor.DepositAmount)
  })

  it('remains in waiting state when given a proxy address', async () => {
    const sm = new BusinesLogicStateMachine()
    await sm.transition({ kind: ActionKinds.ProvideProxyAddress, proxyAddress: '0x proxy address' })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.NotConfirmable)
    expect(state.waitingFor).not.toContain(WaitFor.ProxyAddress)
  })

  it('remains in waiting state when given a conversion rate', async () => {
    const sm = new BusinesLogicStateMachine()
    await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.NotConfirmable)
    expect(state.waitingFor).not.toContain(WaitFor.ConversionRate)
  })

  it('applies converted value when it deposit amount and conversion rate', async () => {
    const sm = new BusinesLogicStateMachine()
    await sm.transition({ kind: ActionKinds.DepositAmount, amount: 10 })
    await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    const state = sm.getCurrentState()
    expect(state.receivedAmount).toEqual(7)
  })

  it('accepts new business values when in transaction pending', async () => {
    const sm = new BusinesLogicStateMachine()
    await sm.transition({ kind: ActionKinds.DepositAmount, amount: 150 })
    await sm.transition({ kind: ActionKinds.ProvideProxyAddress, proxyAddress: '0x proxy address' })
    await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.8 })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.Confirmable)
    expect(state.receivedAmount).toEqual(120)
    expect(state.waitingFor).toEqual([])
  })

  describe('when transaction can be confirmed', () => {
    const tests = [
      {
        depositAmount: 100,
        ratio: 0.5,
        confirmable: false,
      },
      {
        depositAmount: 100,
        ratio: 1.5,
        confirmable: true,
      },
    ]

    tests.forEach((t) => {
      it(`sets confirmable to ${t.confirmable} when depositAmount ${t.depositAmount} and ratio is ${t.ratio}`, async () => {
        const sm = new BusinesLogicStateMachine()
        await sm.transition({ kind: ActionKinds.DepositAmount, amount: t.depositAmount })
        await sm.transition({
          kind: ActionKinds.ProvideProxyAddress,
          proxyAddress: '0x proxy address',
        })
        await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: t.ratio })

        let confirmable

        sm.confirmable$().subscribe((c: boolean) => (confirmable = c))

        expect(confirmable).toEqual(t.confirmable)
      })
    })

    it('sets transaction to not confirmable when the price dips back below the amount', async () => {
      const sm = new BusinesLogicStateMachine()
      await sm.transition({ kind: ActionKinds.DepositAmount, amount: 100 })
      await sm.transition({
        kind: ActionKinds.ProvideProxyAddress,
        proxyAddress: '0x proxy address',
      })
      await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 1.5 })
      await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.5 })

      let confirmable

      sm.confirmable$().subscribe((c: boolean) => (confirmable = c))

      expect(confirmable).toEqual(false)
    })
  })

  describe('confirming the transaction', () => {
    it('moves the state to confirmed if the promise resolves', async () => {
      const sm = new BusinesLogicStateMachine()
      await sm.transition({ kind: ActionKinds.DepositAmount, amount: 100 })
      await sm.transition({
        kind: ActionKinds.ProvideProxyAddress,
        proxyAddress: '0x proxy address',
      })
      await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 1.5 })

      await sm.transition({
        kind: ActionKinds.ConfirmTransaction,
        apply: (state) => Promise.resolve(),
      })

      sm.getCurrentState()

      expect(sm.getCurrentState().state).toEqual(States.TransactionConfirmed)
    })

    it('moves the state to confirmable if the promise rejects', async () => {
      const sm = new BusinesLogicStateMachine()
      await sm.transition({ kind: ActionKinds.DepositAmount, amount: 100 })
      await sm.transition({
        kind: ActionKinds.ProvideProxyAddress,
        proxyAddress: '0x proxy address',
      })
      await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 1.5 })

      await sm.transition({
        kind: ActionKinds.ConfirmTransaction,
        apply: (state) => Promise.reject(),
      })

      sm.getCurrentState()

      expect(sm.getCurrentState().state).toEqual(States.Confirmable)
    })

    it('throws if the state is not confirmable already', async () => {
      const sm = new BusinesLogicStateMachine()
      await sm.transition({ kind: ActionKinds.DepositAmount, amount: 100 })
      await sm.transition({
        kind: ActionKinds.ProvideProxyAddress,
        proxyAddress: '0x proxy address',
      })
      await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.5 })

      await expect(
        sm.transition({
          kind: ActionKinds.ConfirmTransaction,
          apply: (state) => Promise.reject(),
        }),
      ).rejects.toThrow()
    })

    it('ignores new values while transaction is pending', async () => {
      const sm = new BusinesLogicStateMachine()
      await sm.transition({ kind: ActionKinds.DepositAmount, amount: 100 })
      await sm.transition({
        kind: ActionKinds.ProvideProxyAddress,
        proxyAddress: '0x proxy address',
      })
      await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 1.5 })

      sm.transition({
        kind: ActionKinds.ConfirmTransaction,
        apply: (state) => new Promise((resolve) => setTimeout(resolve, 1000)),
      })

      await sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.5 })

      await expect(sm.getCurrentState()).toEqual(
        expect.objectContaining({
          state: States.TransactionPending,
          receivedAmount: 150,
        }),
      )
    })
  })
})
