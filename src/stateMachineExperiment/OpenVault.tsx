import { States as ViewStates } from './view.stateMachine'
import { EnterAmount } from './components/EnterDepositAmount'
import { useOpenVaultViewFacade } from './useOpenVaultView.facade'
import { GetProxy } from './components/GetProxy'
import { TransactionConfirmation } from './components/TransactionConfirmation'
import { TransactionConfirmed } from './components/TransactionConfirmed'

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
          canConfirmDepositAmount={viewModel.canConfirmDepositAmount}
        />
      )
    case ViewStates.AwaitingProxyAddress:
      return (
        <GetProxy
          depositAmount={viewModel.depositAmount || 0}
          confirmProxy={viewModel.setProxyAddress}
        />
      )
    case ViewStates.AwaitingTransactionConfirmation:
      return (
        <TransactionConfirmation
          depositAmount={viewModel.depositAmount || 0}
          withdrawnAmount={viewModel.withdrawnAmount || 0}
          ratio={viewModel.conversionRate || 0}
          canConfirm={viewModel.canConfirm}
          confirmTransaction={viewModel.confirmTransaction}
        />
      )
    case ViewStates.TransactionConfirmed:
      return <TransactionConfirmed />
    default:
      throw new Error('unimplemented')
  }
}
