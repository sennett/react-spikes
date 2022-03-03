import { ActionKinds, BusinesLogicStateMachine, States, WaitFor } from './businesLogic.stateMachine'

describe('it runs a test', () => {
  it('defaults to initial waiting state', () => {
    const sm = new BusinesLogicStateMachine()
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.AwaitingInput)
    expect(state.waitingFor).toContain(WaitFor.ProxyAddress)
    expect(state.waitingFor).toContain(WaitFor.DepositAmount)
    expect(state.waitingFor).toContain(WaitFor.ConversionRate)
  })

  it('remains in waiting state when given a deposit amount', () => {
    const sm = new BusinesLogicStateMachine()
    sm.transition({ kind: ActionKinds.DepositAmount, amount: 20 })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.AwaitingInput)
    expect(state.waitingFor).not.toContain(WaitFor.DepositAmount)
  })

  it('remains in waiting state when given a proxy address', () => {
    const sm = new BusinesLogicStateMachine()
    sm.transition({ kind: ActionKinds.ProvideProxyAddress, proxyAddress: '0x proxy address' })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.AwaitingInput)
    expect(state.waitingFor).not.toContain(WaitFor.ProxyAddress)
  })

  it('remains in waiting state when given a conversion rate', () => {
    const sm = new BusinesLogicStateMachine()
    sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.AwaitingInput)
    expect(state.waitingFor).not.toContain(WaitFor.ConversionRate)
  })

  it('applies converted value when it deposit amount and conversion rate', () => {
    const sm = new BusinesLogicStateMachine()
    sm.transition({ kind: ActionKinds.DepositAmount, amount: 10 })
    sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    const state = sm.getCurrentState()
    expect(state.receivedAmount).toEqual(7)
  })

  it('moves to transaction pending state when it has all the things', () => {
    const sm = new BusinesLogicStateMachine()
    sm.transition({ kind: ActionKinds.DepositAmount, amount: 20 })
    sm.transition({ kind: ActionKinds.ProvideProxyAddress, proxyAddress: '0x proxy address' })
    sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.TransactionPending)
    expect(state.waitingFor).toEqual([])
  })

  it('accepts new business values when in transaction pending', () => {
    const sm = new BusinesLogicStateMachine()
    sm.transition({ kind: ActionKinds.DepositAmount, amount: 20 })
    sm.transition({ kind: ActionKinds.ProvideProxyAddress, proxyAddress: '0x proxy address' })
    sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.8 })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.TransactionPending)
    expect(state.receivedAmount).toEqual(16)
    expect(state.waitingFor).toEqual([])
  })

  it('moves to transaction confirmed state when transaction is confirmed', () => {
    const sm = new BusinesLogicStateMachine()
    sm.transition({ kind: ActionKinds.DepositAmount, amount: 20 })
    sm.transition({ kind: ActionKinds.ProvideProxyAddress, proxyAddress: '0x proxy address' })
    sm.transition({ kind: ActionKinds.UpdateConversionRate, conversionRate: 0.7 })
    sm.transition({ kind: ActionKinds.ConfirmTransaction })
    const state = sm.getCurrentState()
    expect(state.state).toEqual(States.TransactionConfirmed)
    expect(state.waitingFor).toEqual([])
  })

  it.todo('handles invalid states')
})
