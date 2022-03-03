import { ActionKinds as BlActionKinds, BusinesLogicStateMachine } from './businesLogic.stateMachine'
import {
  ActionKinds as VsActionKinds,
  States as ViewStates,
  ViewStateMachine,
} from './view.stateMachine'
import { useObservable } from '../helpers/useObservable'

const businesLogicStateMachine = new BusinesLogicStateMachine()
const viewStateMachine = new ViewStateMachine()

type ViewModel = {
  updateDepositAmount: (depositAmount?: number) => void
  confirmDepositAmount: () => void
  depositAmount?: number
  viewStage: ViewStates
  setProxyAddress: (address: string) => void
}

export function useOpenVaultViewFacade(): ViewModel | undefined {
  const viewState = useObservable(viewStateMachine.getState$())
  const bizState = useObservable(businesLogicStateMachine.getState$())

  if (!viewState || !bizState) {
    return undefined
  }

  return {
    updateDepositAmount: (depositAmount?: number) => {
      businesLogicStateMachine.transition({
        kind: BlActionKinds.DepositAmount,
        amount: depositAmount,
      })
    },
    confirmDepositAmount: () => viewStateMachine.transition({ kind: VsActionKinds.SetDeposit }),
    viewStage: viewState.state,
    depositAmount: bizState.depositAmount,
    setProxyAddress: (address: string) => {
      businesLogicStateMachine.transition({
        kind: BlActionKinds.ProvideProxyAddress,
        proxyAddress: address,
      })
      viewStateMachine.transition({ kind: VsActionKinds.SetProxyAddress })
    },
  }
}
