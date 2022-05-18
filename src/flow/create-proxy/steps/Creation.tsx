import { GenericStepProps } from '../../Flow'
import { useEffect } from 'react'
import { useLoadingDots } from '../../hooks/useLoadingDots'

export type CreationProps = {
  walletAddress: string
  proxyAddress?: string
}

export function Creation(props: GenericStepProps<CreationProps>) {
  const dots = useLoadingDots()

  useEffect(() => {
    setTimeout(() => {
      props.updateState({ proxyAddress: '0xProxyAddress' })
      props.next!()
    }, 3000)
  }, [])

  return (
    <>
      Creating proxy...
      <br />
      {dots}
    </>
  )
}
