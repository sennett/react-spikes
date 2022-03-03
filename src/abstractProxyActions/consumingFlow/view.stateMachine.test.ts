import { ActionKinds, States, ViewStateMachine } from './view.stateMachine'

describe('ViewStateMachine', () => {
  it('starts with AwaitingDeposit', () => {
    const sm = new ViewStateMachine()
    const state = sm.getState()
    expect(state.state).toEqual(States.AwaitingDeposit)
  })

  it('moves to AwaitingProxyAddress after setting deposit', () => {
    const sm = new ViewStateMachine()
    sm.transition({ kind: ActionKinds.SetDeposit })
    const state = sm.getState()
    expect(state.state).toEqual(States.AwaitingProxyAddress)
  })

  it('moves to AwaitingTransactionConfirmation after setting proxy address', () => {
    const sm = new ViewStateMachine()
    sm.transition({ kind: ActionKinds.SetDeposit })
    sm.transition({ kind: ActionKinds.SetProxyAddress })
    const state = sm.getState()
    expect(state.state).toEqual(States.AwaitingTransactionConfirmation)
  })

  it('moves to TransactionConfirmed after confirming transaction', () => {
    const sm = new ViewStateMachine()
    sm.transition({ kind: ActionKinds.SetDeposit })
    sm.transition({ kind: ActionKinds.SetProxyAddress })
    sm.transition({ kind: ActionKinds.ConfirmTransaction })
    const state = sm.getState()
    expect(state.state).toEqual(States.TransactionConfirmed)
  })
})
