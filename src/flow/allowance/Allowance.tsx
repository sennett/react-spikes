import { Flow, ISkippableStep } from '../Flow'
import {
  ConfigureAllowanceAmount,
  ConfigureAllowanceAmountProps,
} from './steps/ConfigureAllowanceAmount'
import { Done, DoneProps } from './steps/Done'
import { useEffect, useState } from 'react'
import { getAllowance$ } from './allowancePipes'

export type AllowanceProps = ConfigureAllowanceAmountProps & DoneProps

export const Allowance: ISkippableStep<AllowanceProps> = {
  Component: (props) => {
    useEffect(() => {
      const subscription = getAllowance$(props.walletAddress).subscribe({
        next: (allowance: number | undefined) => {
          props.updateState({ configuredAllowance: allowance })
        },
      })
      return () => subscription.unsubscribe()
    }, [])

    return (
      <Flow<AllowanceProps> {...props} name="allowance" steps={[ConfigureAllowanceAmount, Done]} />
    )
  },
  canSkip: (props) => {
    return (
      props.depositAmount !== undefined &&
      props.configuredAllowance !== undefined &&
      props.configuredAllowance >= props.depositAmount
    )
  },
}
