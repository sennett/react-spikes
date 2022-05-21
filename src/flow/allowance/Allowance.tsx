import { Flow, GenericStepProps, IStep } from '../Flow'
import {
  ConfigureAllowanceAmount,
  ConfigureAllowanceAmountProps,
} from './steps/ConfigureAllowanceAmount'
import { Done, DoneProps } from './steps/Done'
import { useEffect, useState } from 'react'
import { Observable, of, Subject, switchMap } from 'rxjs'

export type AllowanceProps = ConfigureAllowanceAmountProps & DoneProps

export const Allowance: IStep<AllowanceProps> = {
  Component: (props: GenericStepProps<AllowanceProps>) => {
    const [viewState, setViewState] = useState<AllowanceProps>(props)
    const state$ = new Subject<AllowanceProps>()

    useEffect(() => {
      if (props.configuredAllowance) {
        props.skip!()
      }
    }, [])

    return (
      <Flow<AllowanceProps>
        {...viewState}
        name="allowance"
        steps={[ConfigureAllowanceAmount, Done]}
        updateState={(newState) => {
          setViewState((oldState) => {
            const nextState = { ...oldState, ...newState }
            state$.next(nextState)
            return nextState
          })
          props.updateState(newState)
        }}
        state$={state$.asObservable()}
      />
    )
  },
  canSkip$: (state$: Observable<AllowanceProps>): Observable<boolean> => {
    return state$.pipe(switchMap((state) => of(!!state.configuredAllowance)))
  },
}
