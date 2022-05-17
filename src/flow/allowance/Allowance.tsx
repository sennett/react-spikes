import { Flow, GenericStepProps } from '../Flow'
import {
  ConfigureAllowanceAmount,
  ConfigureAllowanceAmountProps,
} from './steps/ConfigureAllowanceAmount'
import { Done, DoneProps } from './steps/Done'
import { useState } from 'react'

export type AllowanceProps = ConfigureAllowanceAmountProps & DoneProps

export function Allowance(props: GenericStepProps<AllowanceProps>) {
  const [viewState, setViewState] = useState<AllowanceProps>(props)
  return (
    <Flow<AllowanceProps>
      {...viewState}
      name="allowance"
      steps={[ConfigureAllowanceAmount, Done]}
      updateState={(newState) => setViewState((oldState) => ({ ...oldState, ...newState }))}
    />
  )
}
