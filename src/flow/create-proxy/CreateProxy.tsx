import { Flow, ISkippableStep } from '../Flow'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, CreationProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'

export type CreateProxyProps = ExplanationProps & CreationProps & DoneProps

export const CreateProxy: ISkippableStep<CreateProxyProps> = {
  Component: function CreateProxy(props) {
    return (
      <Flow<CreateProxyProps>
        {...props}
        name="proxy"
        steps={[Explanation, Creation, Done]}
        updateState={(newState) => props.updateState(newState)}
        hidden={props.hidden}
      />
    )
  },
  canSkip: (props: CreateProxyProps) => {
    return !!props.proxyAddress
  },
  displayName: 'CreateProxy',
}
