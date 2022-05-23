import { IStep } from '../../Flow'
import { useEffect } from 'react'
import { useLoadingDots } from '../../hooks/useLoadingDots'
import { clear } from '@testing-library/user-event/dist/clear'

export type CreationProps = {
  walletAddress: string
  proxyAddress?: string
}

export const Creation: IStep<CreationProps> = {
  Component: (props) => {
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
}
