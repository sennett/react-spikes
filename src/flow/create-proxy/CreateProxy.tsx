import { Flow, GenericStepProps } from '../Flow'
import { useState } from 'react'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, CreationProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'
import { useSkip } from '../hooks/useSkip'

export type CreateProxyProps = ExplanationProps & CreationProps & DoneProps

export function CreateProxy(props: GenericStepProps<CreateProxyProps>) {
  const loading = useSkip(props.skip, [props.proxyAddress])
  const [viewState, setViewState] = useState<CreateProxyProps>(props)

  if (loading) return <></>

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
