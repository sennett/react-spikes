import { Flow, GenericStepProps, ISkippableStep } from '../Flow'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Done, DoneProps } from './steps/Done'
import { useEffect } from 'react'
import { getProxy$ } from './proxyPipes'

export type CreateProxyProps = ExplanationProps & DoneProps

export type ProxyCreated = {
  proxyAddress: string
}

export const CreateProxy: ISkippableStep<CreateProxyProps> = {
  Component: (props: GenericStepProps<CreateProxyProps>) => {
    useEffect(() => {
      const subscription = getProxy$(props.walletAddress).subscribe({
        next: (proxyAddress: string | undefined) => {
          props.updateState({ proxyAddress })
        },
      })
      return () => subscription.unsubscribe()
    }, [])

    return <Flow<CreateProxyProps> {...props} name="proxy" steps={[Explanation, Done]} />
  },
  canSkip: (props: CreateProxyProps) => {
    return !!props.proxyAddress
  },
}
