import { Flow, GenericStepProps, ISkippableStep } from '../Flow'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Done, DoneProps } from './steps/Done'

export type CreateProxyProps = ExplanationProps & DoneProps

export type ProxyCreated = {
  proxyAddress: string
}

export const CreateProxy: ISkippableStep<CreateProxyProps> = {
  Component: (props: GenericStepProps<CreateProxyProps>) => {
    return <Flow<CreateProxyProps> {...props} name="proxy" steps={[Explanation, Done]} />
  },
  canSkip: (props: CreateProxyProps) => {
    return !!props.proxyAddress
  },
}
