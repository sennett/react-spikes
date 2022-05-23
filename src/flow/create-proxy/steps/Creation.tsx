import { GenericStepProps, IStep } from '../../Flow'
import { useEffect } from 'react'
import { useLoadingDots } from '../../hooks/useLoadingDots'

export type CreationProps = {
  walletAddress: string
  proxyAddress?: string
}

export const Creation: IStep<CreationProps> = {
  Component: function Creation(props: GenericStepProps<CreationProps>) {
    const dots = useLoadingDots()

    useEffect(() => {
      const i = setTimeout(() => {
        if (!props.hidden) {
          console.log('updating  step')
          props.updateState({ proxyAddress: '0xProxyAddress' })
          props.next!()
        }
      }, 3000)
      return () => clearTimeout(i)
    }, [props.hidden])

    return (
      <>
        Creating proxy...
        <br />
        {dots}
      </>
    )
  },
  displayName: 'Creation',
}
