import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export enum States {
  NotConfirmable = 'NotConfirmable',
  Confirmable = 'Confirmable',
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
      apply: (state: State) => Promise<void>
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
  getState$(): Observable<State>
  transition(action: Action): void
}

export class BusinesLogicStateMachine implements IFlowStateMachine {
  private state: State = {
    state: States.NotConfirmable,
    waitingFor: [WaitFor.ProxyAddress, WaitFor.ConversionRate, WaitFor.DepositAmount],
  }

  private state$: BehaviorSubject<State> = new BehaviorSubject<State>(this.state)

  private validateTransition(action: Action) {
    const validTransitions = [
      {
        fromStates: [States.NotConfirmable],
        allowedActions: [
          ActionKinds.DepositAmount,
          ActionKinds.ProvideProxyAddress,
          ActionKinds.UpdateConversionRate,
        ],
      },
      {
        fromStates: [States.Confirmable],
        allowedActions: [
          ActionKinds.DepositAmount,
          ActionKinds.ProvideProxyAddress,
          ActionKinds.UpdateConversionRate,
          ActionKinds.ConfirmTransaction,
        ],
      },
      {
        fromStates: [States.TransactionPending],
        allowedActions: [
          ActionKinds.DepositAmount,
          ActionKinds.ProvideProxyAddress,
          ActionKinds.UpdateConversionRate,
        ],
      },
      {
        fromStates: [States.TransactionConfirmed],
        allowedActions: [
          ActionKinds.DepositAmount,
          ActionKinds.ProvideProxyAddress,
          ActionKinds.UpdateConversionRate,
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

  private exitTransition(): void {
    this.state$.next(this.state)
  }

  private updateStateValues(action: Action) {
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
    }

    if (this.state.depositAmount && this.state.conversionRate) {
      this.state = {
        ...this.state,
        receivedAmount: this.state.depositAmount * this.state.conversionRate,
      }
    }
  }

  private updateWaitingFor() {
    this.state.waitingFor = []
    if (!this.state.depositAmount || this.state.depositAmount < 100) {
      this.state.waitingFor.push(WaitFor.DepositAmount)
    }

    if (!this.state.proxyAddress) {
      this.state.waitingFor.push(WaitFor.ProxyAddress)
    }

    if (!this.state.conversionRate) {
      this.state.waitingFor.push(WaitFor.ConversionRate)
    }
  }

  private tryMakeConfirmable() {
    if (
      this.state.depositAmount &&
      this.state.depositAmount >= 100 &&
      this.state.proxyAddress &&
      this.state.receivedAmount &&
      this.state.receivedAmount >= 100
    ) {
      this.state = {
        ...this.state,
        state: States.Confirmable,
      }
    } else {
      this.state = {
        ...this.state,
        state: States.NotConfirmable,
      }
    }
  }

  private checkForIgnoredTransitions(): boolean {
    return (
      this.state.state === States.TransactionPending ||
      this.state.state === States.TransactionConfirmed
    )
  }

  async transition(action: Action) {
    this.validateTransition(action)

    const ignoreTransition = this.checkForIgnoredTransitions()

    if (ignoreTransition) {
      return
    }

    this.updateStateValues(action)

    this.updateWaitingFor()

    this.tryMakeConfirmable()

    if (action.kind === ActionKinds.ConfirmTransaction) {
      try {
        this.state = {
          ...this.state,
          state: States.TransactionPending,
        }
        await action.apply(this.state)
        this.state = {
          ...this.state,
          state: States.TransactionConfirmed,
        }
      } catch (e) {
        this.state = {
          ...this.state,
          state: States.Confirmable,
        }
      }
    }

    this.exitTransition()
  }

  getCurrentState(): State {
    return this.state
  }

  getState$(): Observable<State> {
    return this.state$
  }

  confirmable$(): Observable<boolean> {
    return this.state$.pipe(map((s) => s.state === States.Confirmable))
  }
}
