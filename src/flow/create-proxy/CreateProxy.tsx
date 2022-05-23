import { Flow, GenericStepProps, ISkippableStep } from '../Flow'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, StepProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'

export type CreateProxyProps = ExplanationProps & StepProps & DoneProps

export type ProxyCreated = {
  proxyAddress: string
}

export const CreateProxy: ISkippableStep<CreateProxyProps> = {
  Component: (props: GenericStepProps<CreateProxyProps>) => {
    return (
      <Flow<CreateProxyProps> {...props} name="proxy" steps={[Explanation(), Creation(), Done]} />
    )
  },
  canSkip: (props: CreateProxyProps) => {
    return !!props.proxyAddress
  },
}
