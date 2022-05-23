import { GenericStepProps, IStateProviderStep, IStep } from '../Flow'
import { combineLatest, interval, Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

export type SimulateStepProps = {
  ethPrice: number
  depositAmount?: number
  depositAmountUsd?: number
}

type SimulateStepProvidedState = {
  depositAmount: number
  depositAmountUsd: number
}

export function SimulateStep(): IStateProviderStep<SimulateStepProps, SimulateStepProvidedState> {
  const internalState$ = new Subject<number>()

  const priceStream$ = interval(1000).pipe(map(() => Math.floor(Math.random() * 10000)))

  const updateState$ = combineLatest(priceStream$, internalState$).pipe(
    map(([price, depositAmount]) => {
      return {
        ethPrice: price,
        depositAmount: depositAmount,
        depositAmountUsd: price * depositAmount,
      }
    }),
  )

  return {
    updateState$,

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
              internalState$.next(event.target.value ? parseFloat(event.target.value) : 0)
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
}
