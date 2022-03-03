import { BusinesLogicStateMachine, ActionKinds as BlActionKinds } from './businesLogic.stateMachine'
import {
  ActionKinds as VsActionKinds,
  ViewStateMachine,
  States as ViewStates,
} from './view.stateMachine'
import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

function EnterAmount(props: {
  depositAmountUpdated: (depositAmount: number | undefined) => void
  depositAmountConfirmed: () => void
  depositAmount?: number
}) {
  return (
    <>
      <input
        type="number"
        onChange={(event) => {
          const value = parseInt(event.target.value)
          if (!Number.isNaN(value)) {
            props.depositAmountUpdated(parseInt(event.target.value))
          } else {
            props.depositAmountUpdated(undefined)
          }
        }}
      />
      <button disabled={props.depositAmount === undefined} onClick={props.depositAmountConfirmed}>
        {props.depositAmount === undefined ? 'Deposit amount required' : 'Confirm deposit amount'}
      </button>
    </>
  )
}

function useObservable<T>(obs: Observable<T>): T | undefined {
  const [state, setState] = useState<T | undefined>(undefined)

  useEffect(() => {
    const subscription = obs.subscribe({ next: (state) => setState(state) })
    return () => subscription.unsubscribe()
  }, [obs])

  return state
}

const bizSm = new BusinesLogicStateMachine()
const viewSm = new ViewStateMachine()

export function AbstractProxyActions() {
  const viewState = useObservable(viewSm.getState$())
  const bizState = useObservable(bizSm.getState$())

  if (!viewState || !bizState) {
    return <>loading</>
  }

  switch (viewState.state) {
    case ViewStates.AwaitingDeposit:
      return (
        <EnterAmount
          depositAmountUpdated={(depositAmount?: number) => {
            bizSm.transition({ kind: BlActionKinds.DepositAmount, amount: depositAmount })
          }}
          depositAmountConfirmed={() => viewSm.transition({ kind: VsActionKinds.SetDeposit })}
          depositAmount={bizState?.depositAmount}
        />
      )
    case ViewStates.AwaitingProxyAddress:
      return <>awaiting proxy</>
    default:
      throw new Error('unimplemented')
  }
}
