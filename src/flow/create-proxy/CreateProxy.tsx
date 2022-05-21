import { Flow, IStep } from '../Flow'
import { useEffect, useState } from 'react'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, CreationProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'
import { useObservable } from '../../stateMachineExperiment/helpers/useObservable'
import { proxy$ } from './CreateProxy.pipe'
import { Observable, Subject, switchMap, of } from 'rxjs'

export type CreateProxyProps = ExplanationProps & CreationProps & DoneProps

export const CreateProxy: IStep<CreateProxyProps> = {
  Component: (props) => {
    const [viewState, setViewState] = useState<CreateProxyProps>(props)
    const proxyViewModel = useObservable(proxy$)
    const state$ = new Subject<CreateProxyProps>()

    useEffect(() => {
      setViewState((oldState) => {
        return {
          ...oldState,
          proxyAddress: proxyViewModel?.proxy,
        }
      })
    }, [proxyViewModel])

    return (
      <Flow<CreateProxyProps>
        {...viewState}
        name="proxy"
        steps={[Explanation, Creation, Done]}
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
  canSkip$: (state$: Observable<CreateProxyProps>): Observable<boolean> => {
    return state$.pipe(switchMap((state) => of(!!state.proxyAddress)))
  },
}
