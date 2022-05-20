import { GenericStepProps, IStep } from '../Flow'

export type SimulateStepProps = {
  ethPrice: number
  depositAmount?: number
  depositAmountUsd?: number
}

export const SimulateStep: IStep<SimulateStepProps> = {
  Component: (props: GenericStepProps<SimulateStepProps>) => {
    return (
      <>
        Simulate vault
        <br />
        Eth price: {props.ethPrice}
        <br />
        Deposit amount:{' '}
        <input
          type="number"
          value={props.depositAmount || ''}
          onChange={(event) =>
            props.updateState({
              ...props,
              depositAmount: event.target.value ? parseFloat(event.target.value) : undefined,
            })
          }
        />
        {props.depositAmountUsd && (
          <>
            <br />({props.depositAmountUsd} USD)
          </>
        )}
        <br />
        <button disabled={!props.previous} onClick={props.previous}>
          previous
        </button>
        <button disabled={!props.depositAmountUsd || !props.next} onClick={props.next}>
          next
        </button>
      </>
    )
  },
}
