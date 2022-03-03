import { action } from '@datorama/akita'
import { BehaviorSubject, Observable } from 'rxjs'

export enum States {
  AwaitingInput = 'AwaitingInput',
  TransactionPending = 'TransactionPending',
  TransactionConfirmed = 'TransactionConfirmed',
}

export enum ActionKinds {
  DepositAmount = 'DepositAmount',
  ProvideProxyAddress = 'ProvideProxyAddress',
  ConfirmTransaction = 'ConfirmTransaction',
  UpdateConversionRate = 'UpdateConversionRate',
}

export enum WaitFor {
  ProxyAddress = 'ProxyAddress',
  DepositAmount = 'DepositAmount',
  ConversionRate = 'ConversionRate',
}

export type Action =
  | {
      kind: ActionKinds.DepositAmount
      amount?: number
    }
  | {
      kind: ActionKinds.ProvideProxyAddress
      proxyAddress: string
    }
  | {
      kind: ActionKinds.ConfirmTransaction
    }
  | {
      kind: ActionKinds.UpdateConversionRate
      conversionRate: number
    }

type State = {
  depositAmount?: number
  state: States
  proxyAddress?: string
  conversionRate?: number
  receivedAmount?: number
  waitingFor: Array<WaitFor>
}

interface IFlowStateMachine {
  getCurrentState(): State
  transition(action: Action): void
}

export class BusinesLogicStateMachine implements IFlowStateMachine {
  private state: State = {
    state: States.AwaitingInput,
    waitingFor: [WaitFor.ProxyAddress, WaitFor.ConversionRate, WaitFor.DepositAmount],
  }

  private state$: BehaviorSubject<State> = new BehaviorSubject<State>(this.state)

  private validateTransition(action: Action) {
    const validTransitions = [
      {
        fromStates: [States.AwaitingInput],
        allowedActions: [
          ActionKinds.DepositAmount,
          ActionKinds.ProvideProxyAddress,
          ActionKinds.UpdateConversionRate,
        ],
      },
      {
        fromStates: [States.TransactionPending],
        allowedActions: [
          ActionKinds.DepositAmount,
          ActionKinds.ProvideProxyAddress,
          ActionKinds.UpdateConversionRate,
          ActionKinds.ConfirmTransaction,
        ],
      },
    ]

    let validTransition = validTransitions.find(
      ({ fromStates, allowedActions }) =>
        fromStates.includes(this.state.state) && allowedActions.includes(action.kind),
    )

    if (!validTransition)
      throw new Error(`invalid state transition.  from: ${this.state.state}, action: ${action}`)
  }

  transition(action: Action) {
    this.validateTransition(action)

    switch (action.kind) {
      case ActionKinds.DepositAmount:
        this.state = {
          ...this.state,
          depositAmount: action.amount,
        }
        break
      case ActionKinds.ProvideProxyAddress:
        this.state = {
          ...this.state,
          proxyAddress: action.proxyAddress,
        }
        break
      case ActionKinds.UpdateConversionRate:
        this.state = {
          ...this.state,
          conversionRate: action.conversionRate,
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

    this.state.waitingFor = []
    if (!this.state.depositAmount) {
      this.state.waitingFor.push(WaitFor.DepositAmount)
    }

    if (!this.state.proxyAddress) {
      this.state.waitingFor.push(WaitFor.ProxyAddress)
    }

    if (!this.state.conversionRate) {
      this.state.waitingFor.push(WaitFor.ConversionRate)
    }

    if (
      this.state.depositAmount &&
      this.state.proxyAddress &&
      this.state.conversionRate &&
      action.kind !== ActionKinds.ConfirmTransaction
    ) {
      this.state = {
        ...this.state,
        state: States.TransactionPending,
      }
    }

    if (this.state.depositAmount && this.state.conversionRate) {
      this.state = {
        ...this.state,
        receivedAmount: this.state.depositAmount * this.state.conversionRate,
      }
    }
    this.state$.next(this.state)
  }

  getCurrentState(): State {
    return this.state
  }

  getState$(): Observable<State> {
    return this.state$
  }
}
