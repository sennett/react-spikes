import { IStateProviderStep, IStep } from '../../Flow'
import { useEffect } from 'react'
import { useLoadingDots } from '../../hooks/useLoadingDots'
import { clear } from '@testing-library/user-event/dist/clear'
import { Subject } from 'rxjs'

export type StepProps = {
  walletAddress: string
  proxyAddress?: string
}

type StateFromStep = { proxyAddress: string }

export function Creation(): IStateProviderStep<StepProps, StateFromStep> {
  const updateState$ = new Subject<StateFromStep>()
  return {
    updateState$,
    Component: (props) => {
      const dots = useLoadingDots()

      useEffect(() => {
        const i = setTimeout(() => {
          updateState$.next({ proxyAddress: '0xProxyAddress' })
          props.next!()
        }, 3000)
        return () => clearTimeout(i)
      }, [])

      return (
        <>
          Creating proxy...
          <br />
          {dots}
        </>
      )
    },
  }
}
