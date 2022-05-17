import { Flow, GenericStepProps } from '../Flow'
import {
  ConfigureAllowanceAmount,
  ConfigureAllowanceAmountProps,
} from './steps/ConfigureAllowanceAmount'
import { Done, DoneProps } from './steps/Done'
import { useEffect, useState } from 'react'

export type AllowanceProps = ConfigureAllowanceAmountProps & DoneProps

export function Allowance(props: GenericStepProps<AllowanceProps>) {
  const [viewState, setViewState] = useState<AllowanceProps>(props)

  useEffect(() => {
    if (props.configuredAllowance) {
      props.skip!()
    }
  }, [])

  return (
    <Flow<AllowanceProps>
      {...viewState}
      name="allowance"
      steps={[ConfigureAllowanceAmount, Done]}
      updateState={(newState) => {
        setViewState((oldState) => ({ ...oldState, ...newState }))
        props.updateState(newState)
      }}
    />
  )
}
