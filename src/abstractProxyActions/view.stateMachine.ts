import { BehaviorSubject, Observable } from 'rxjs'

export enum States {
  AwaitingDeposit = 'AwaitingDeposit',
  AwaitingProxyAddress = 'AwaitingProxyAddress',
  AwaitingTransactionConfirmation = 'AwaitingTransactionConfirmation',
  TransactionConfirmed = 'TransactionConfirmed',
}

type ViewState = {
  state: States
  convertedValue?: number
  conversationRate?: number
}

export enum ActionKinds {
  SetDeposit = 'SetDeposit',
  SetProxyAddress = 'SetProxyAddress',
  ConfirmTransaction = 'ConfirmTransaction',
}

type Action =
  | {
      kind: ActionKinds.SetDeposit
    }
  | {
      kind: ActionKinds.SetProxyAddress
      proxyAddress: string
    }
  | {
      kind: ActionKinds.ConfirmTransaction
    }

interface IViewStateMachine {
  transition(action: Action): void
  getState(): ViewState
}

export class ViewStateMachine implements IViewStateMachine {
  private state: ViewState = {
    state: States.AwaitingDeposit,
  }

  private state$: BehaviorSubject<ViewState> = new BehaviorSubject<ViewState>(this.state)

  private validateTransition(action: Action) {
    const validTransitions = [
      {
        fromStates: [States.AwaitingDeposit],
        allowedActions: [ActionKinds.SetDeposit],
      },
      {
        fromStates: [States.AwaitingProxyAddress],
        allowedActions: [ActionKinds.SetProxyAddress],
      },
      {
        fromStates: [States.AwaitingTransactionConfirmation],
        allowedActions: [ActionKinds.ConfirmTransaction],
      },
    ]

    let validTransition = validTransitions.find(
      ({ fromStates, allowedActions }) =>
        fromStates.includes(this.state.state) && allowedActions.includes(action.kind),
    )

    if (!validTransition)
      throw new Error(`invalid state transition.  from: ${this.state.state}, action: ${action}`)
  }

  getState(): ViewState {
    return this.state
  }

  getState$(): Observable<ViewState> {
    return this.state$
  }

  transition(action: Action) {
    this.validateTransition(action)
    switch (action.kind) {
      case ActionKinds.SetDeposit:
        this.state = {
          ...this.state,
          state: States.AwaitingProxyAddress,
        }
        break
      case ActionKinds.SetProxyAddress:
        this.state = {
          ...this.state,
          state: States.AwaitingTransactionConfirmation,
        }
        break
      case ActionKinds.ConfirmTransaction:
        this.state = {
          ...this.state,
          state: States.TransactionConfirmed,
        }
        break
      default:
        throw new Error('unrecognised transition')
    }

    this.state$.next(this.state)
  }
}
