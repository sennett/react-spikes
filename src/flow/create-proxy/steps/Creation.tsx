import { GenericStepProps, IStep } from '../../Flow'
import { useEffect } from 'react'
import { useLoadingDots } from '../../hooks/useLoadingDots'
import { Observable, of } from 'rxjs'

export type CreationProps = {
  walletAddress: string
  proxyAddress?: string
}

export const Creation: IStep<CreationProps> = {
  Component: (props: GenericStepProps<CreationProps>) => {
    const dots = useLoadingDots()

    useEffect(() => {
      const i = setTimeout(() => {
        console.log('updating  step')
        props.updateState({ proxyAddress: '0xProxyAddress' })
        console.log('calling next')
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
  canSkip$: (): Observable<boolean> => {
    return of(false)
  },
}
