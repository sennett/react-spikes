import { Flow, GenericStepProps } from '../Flow'
import { useState } from 'react'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, CreationProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'

export type CreateProxyProps = ExplanationProps & CreationProps & DoneProps

export function CreateProxy(props: GenericStepProps<CreateProxyProps>) {
  const [viewState, setViewState] = useState<CreateProxyProps>(props)
  return (
    <Flow<CreateProxyProps>
      {...viewState}
      name="proxy"
      steps={[Explanation, Creation, Done]}
      updateState={(newState) => setViewState((oldState) => ({ ...oldState, ...newState }))}
    />
  )
}
