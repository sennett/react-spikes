import { States as ViewStates } from './view.stateMachine'
import { EnterAmount } from './components/EnterDepositAmount'
import { useOpenVaultViewFacade } from './useOpenVaultView.facade'

export function OpenVault() {
  const viewModel = useOpenVaultViewFacade()

  if (!viewModel) {
    return <>loading</>
  }

  switch (viewModel.viewStage) {
    case ViewStates.AwaitingDeposit:
      return (
        <EnterAmount
          depositAmountUpdated={viewModel.updateDepositAmount}
          depositAmountConfirmed={viewModel.confirmDepositAmount}
          depositAmount={viewModel.depositAmount}
        />
      )
    case ViewStates.AwaitingProxyAddress:
      return <>awaiting proxy</>
    default:
      throw new Error('unimplemented')
  }
}
