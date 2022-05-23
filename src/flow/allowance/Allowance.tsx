// import { Flow, ISkippableStep } from '../Flow'
// import {
//   ConfigureAllowanceAmount,
//   ConfigureAllowanceAmountProps,
//   ConfiguredAllowanceAmountProps,
// } from './steps/ConfigureAllowanceAmount'
// import { Done, DoneProps } from './steps/Done'
//
// export type AllowanceProps = ConfigureAllowanceAmountProps
//
// export const Allowance: ISkippableStep<AllowanceProps, ConfiguredAllowanceAmountProps> = {
//   Component: (props) => {
//     return (
//       <Flow
//         {...props}
//         name="allowance"
//         steps={[ConfigureAllowanceAmount, Done]}
//         updateState={(newState) => {
//           props.updateState(newState)
//         }}
//       />
//     )
//   },
//   canSkip: (props) => !!props.configuredAllowance,
// }
export {}
