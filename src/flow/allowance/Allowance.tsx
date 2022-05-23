import { Flow, ISkippableStep } from '../Flow'
import {
  ConfigureAllowanceAmount,
  ConfigureAllowanceAmountProps,
} from './steps/ConfigureAllowanceAmount'
import { Done, DoneProps } from './steps/Done'
import { useEffect, useState } from 'react'

export type AllowanceProps = ConfigureAllowanceAmountProps & DoneProps

export const Allowance: ISkippableStep<AllowanceProps> = {
  Component: (props) => {
    const [viewState, setViewState] = useState<AllowanceProps>(props)

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
  },
  canSkip: (props) => !!props.configuredAllowance,
}
