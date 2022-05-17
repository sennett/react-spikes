import { GenericStepProps } from '../../Flow'
import { useState } from 'react'
import { useLoadingDots } from '../../useLoadingDots'

export type ConfigureAllowanceAmountProps = {
  depositAmount?: number
  configuredAllowance?: number
}

type AllowanceRequestState = 'not sent' | 'in progress' | 'done'

export function ConfigureAllowanceAmount(props: GenericStepProps<ConfigureAllowanceAmountProps>) {
  const [allowanceRequestState, setAllowanceRequestState] =
    useState<AllowanceRequestState>('not sent')
  const dots = useLoadingDots()

  const canProgress =
    props.next &&
    props.configuredAllowance &&
    props.depositAmount &&
    props.configuredAllowance >= props.depositAmount

  function setAllowance() {
    setAllowanceRequestState('in progress')
    setTimeout(() => props.next!(), 1000)
  }

  return (
    <>
      Configure proxy amount
      <br />
      <input
        value={props.configuredAllowance || ''}
        onChange={(e) => props.updateState({ configuredAllowance: parseInt(e.target.value) })}
      />
      <br />
      {allowanceRequestState === 'in progress' && (
        <>
          {dots}
          <br />
        </>
      )}
      <button disabled={!canProgress} onClick={setAllowance}>
        set allowance
      </button>
    </>
  )
}
