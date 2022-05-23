import { IStep } from '../../Flow'
import { useEffect } from 'react'
import { useLoadingDots } from '../../hooks/useLoadingDots'

export type StepProps = {
  walletAddress: string
  proxyAddress?: string
}

type StateFromStep = { proxyAddress: string }

export function Creation(): IStep<StepProps> {
  return {
    Component: (props) => {
      const dots = useLoadingDots()

      useEffect(() => {
        const i = setTimeout(() => {
          props.updateState!({ proxyAddress: '0xProxyAddress' })
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
