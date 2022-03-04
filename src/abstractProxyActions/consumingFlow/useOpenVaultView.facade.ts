import {
  ActionKinds,
  ActionKinds as BlActionKinds,
  BusinesLogicStateMachine,
  WaitFor,
} from './businesLogic.stateMachine'
import {
  ActionKinds as VsActionKinds,
  States as ViewStates,
  ViewStateMachine,
} from './view.stateMachine'
import { useObservable } from '../helpers/useObservable'
import { firstValueFrom, interval, mapTo } from 'rxjs'
import { map } from 'rxjs/operators'

const businesLogicStateMachine = new BusinesLogicStateMachine()
const viewStateMachine = new ViewStateMachine()

const conversionRateStream = interval(1000).pipe(map((v: number) => (v % 2 === 0 ? 0.5 : 1.5)))

conversionRateStream.subscribe((v) =>
  businesLogicStateMachine.transition({
    kind: ActionKinds.UpdateConversionRate,
    conversionRate: v,
  }),
)

type ViewModel = {
  updateDepositAmount: (depositAmount?: number) => void
  confirmDepositAmount: () => void
  canConfirmDepositAmount: boolean
  depositAmount?: number
  viewStage: ViewStates
  setProxyAddress: (address: string) => void
  withdrawnAmount?: number
  conversionRate?: number
  canConfirm: boolean
  confirmTransaction: () => void
}

export function useOpenVaultViewFacade(): ViewModel | undefined {
  const viewState = useObservable(viewStateMachine.getState$())
  const bizState = useObservable(businesLogicStateMachine.getState$())
  const confirmable = useObservable(businesLogicStateMachine.confirmable$())

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
    canConfirmDepositAmount: !bizState.waitingFor.includes(WaitFor.DepositAmount),
    viewStage: viewState.state,
    depositAmount: bizState.depositAmount,
    setProxyAddress: (address: string) => {
      businesLogicStateMachine.transition({
        kind: BlActionKinds.ProvideProxyAddress,
        proxyAddress: address,
      })
      viewStateMachine.transition({ kind: VsActionKinds.SetProxyAddress })
    },
    withdrawnAmount: bizState.receivedAmount,
    conversionRate: bizState.conversionRate,
    canConfirm: confirmable || false,
    confirmTransaction: () => {
      businesLogicStateMachine.transition({
        kind: ActionKinds.ConfirmTransaction,
        apply: (state) => firstValueFrom(interval(1000).pipe(mapTo(undefined))),
      })
    },
  }
}
