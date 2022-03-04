type TransactionConfirmationProps = {
  depositAmount: number
  withdrawnAmount: number
  ratio: number
  confirmTransaction: () => void
  canConfirm: boolean
}

export function TransactionConfirmation(props: TransactionConfirmationProps) {
  return (
    <>
      Confirming transaction
      <br />
      Deposit amount: {props.depositAmount}
      <br />
      withdrawnAmount: {props.withdrawnAmount}
      <br />
      ratio: {props.ratio}
      <br />
      <button disabled={!props.canConfirm} onClick={props.confirmTransaction}>
        confirm transaction
      </button>
    </>
  )
}
