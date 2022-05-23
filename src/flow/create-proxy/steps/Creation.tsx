import { IStep } from '../../Flow'
import { useEffect } from 'react'
import { useLoadingDots } from '../../hooks/useLoadingDots'

export type CreationProps = {
  walletAddress: string
  proxyAddress?: string
}

export type CreatedProps = {
  proxyAddress: string
}

export const Creation: IStep<CreationProps, CreatedProps> = {
  Component: (props) => {
    const dots = useLoadingDots()

    useEffect(() => {
      const i = setTimeout(() => {
        props.updateState({ proxyAddress: '0xProxyAddress' })
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
