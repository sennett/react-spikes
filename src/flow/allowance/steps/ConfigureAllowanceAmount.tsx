import { GenericStepProps } from '../../Flow'
import { SyntheticEvent, useState } from 'react'
import { useLoadingDots } from '../../useLoadingDots'

export type ConfigureAllowanceAmountProps = {
  depositAmount?: number
  configuredAllowance?: number
}

type AllowanceRequestState = 'not sent' | 'in progress' | 'done'

export function ConfigureAllowanceAmount(props: GenericStepProps<ConfigureAllowanceAmountProps>) {
  const [allowanceRequestState, setAllowanceRequestState] =
    useState<AllowanceRequestState>('not sent')
  const [selectedRadio, setSelectedRadio] = useState('custom')
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

  function updateRadio(e: SyntheticEvent<HTMLInputElement>) {
    const allowanceRadio = e.currentTarget.value
    setSelectedRadio(e.currentTarget.value)
    if (allowanceRadio === 'minimum') {
      props.updateState({ configuredAllowance: props.depositAmount })
    } else if (allowanceRadio === 'unlimited') {
      props.updateState({ configuredAllowance: Infinity })
    }
  }

  return (
    <>
      Configure proxy allowance
      <br />
      <input
        type="radio"
        name="allowanceType"
        value="custom"
        checked={selectedRadio === 'custom'}
        onChange={updateRadio}
      />
      custom
      <input
        disabled={selectedRadio !== 'custom'}
        value={props.configuredAllowance || ''}
        onChange={(e) => props.updateState({ configuredAllowance: parseInt(e.target.value) })}
      />
      <br />
      <input
        type="radio"
        name="allowanceType"
        value="minimum"
        checked={selectedRadio === 'minimum'}
        onChange={updateRadio}
      />
      minimum
      <br />
      <input
        type="radio"
        name="allowanceType"
        value="unlimited"
        checked={selectedRadio === 'unlimited'}
        onChange={updateRadio}
      />
      infinite
      <br />
      {allowanceRequestState === 'in progress' && (
        <>
          {dots}
          <br />
        </>
      )}
      {!canProgress && (
        <>
          allowance not enough
          <br />
        </>
      )}
      <button onClick={props.previous}>back</button>
      <button disabled={!canProgress} onClick={setAllowance}>
        set allowance
      </button>
    </>
  )
}
