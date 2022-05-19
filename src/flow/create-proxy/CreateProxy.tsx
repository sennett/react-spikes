import { Flow, GenericStepProps } from '../Flow'
import { FC, useState } from 'react'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, CreationProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'

export type CreateProxyProps = ExplanationProps & CreationProps & DoneProps

export type Step<P> = {
  canSkip?: (props: GenericStepProps<P>) => boolean
}

export const CreateProxy: FC<GenericStepProps<CreateProxyProps>> & Step<CreateProxyProps> = (
  props,
) => {
  const [viewState, setViewState] = useState<CreateProxyProps>(props)

  return (
    <Flow<CreateProxyProps>
      {...viewState}
      name="proxy"
      steps={[Explanation, Creation, Done]}
      updateState={(newState) => {
        setViewState((oldState) => ({ ...oldState, ...newState }))
        props.updateState(newState)
      }}
    />
  )
}

CreateProxy.canSkip = (props: GenericStepProps<CreateProxyProps>) => !!props.proxyAddress
