import { Flow, GenericStepProps, ISkippableStep } from '../Flow'
import { FC, useState } from 'react'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, CreationProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'

export type CreateProxyProps = ExplanationProps & CreationProps & DoneProps

export const CreateProxy: ISkippableStep<CreateProxyProps> = {
  Component: (props) => {
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
  },
  canSkip: (props: CreateProxyProps) => {
    return !!props.proxyAddress
  },
}
