import { Flow, GenericStepProps, ISkippableStep } from '../Flow'
import {
  ConfigureAllowanceAmount,
  ConfigureAllowanceAmountProps,
} from './steps/ConfigureAllowanceAmount'
import { Done, DoneProps } from './steps/Done'

export type AllowanceProps = ConfigureAllowanceAmountProps & DoneProps

export const Allowance: ISkippableStep<AllowanceProps> = {
  Component: (props: GenericStepProps<AllowanceProps>) => {
    return (
      <Flow<AllowanceProps>
        {...props}
        name="allowance"
        steps={[ConfigureAllowanceAmount, Done]}
        updateState={(newState) => props.updateState(newState)}
        hidden={props.hidden}
      />
    )
  },
  canSkip: (props) => !!props.configuredAllowance,
  displayName: 'Allowance',
}
