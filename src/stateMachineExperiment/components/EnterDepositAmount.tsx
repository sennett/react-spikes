type EnterAmountProps = {
  depositAmountUpdated: (depositAmount: number | undefined) => void
  depositAmountConfirmed: () => void
  depositAmount?: number
  canConfirmDepositAmount: boolean
}

export function EnterAmount(props: EnterAmountProps) {
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
      <button disabled={!props.canConfirmDepositAmount} onClick={props.depositAmountConfirmed}>
        {props.depositAmount === undefined ? 'Deposit amount required' : 'Confirm deposit amount'}
      </button>
    </>
  )
}
