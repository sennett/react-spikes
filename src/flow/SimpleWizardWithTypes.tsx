import { Flow, IStep } from './Flow'
import { useState } from 'react'

type Step1Required = {
  colPrice: number
  ethValue?: number
}

type Step1Provided = {
  ethValue: number
}

const Step1: IStep<Step1Required, Step1Provided> = {
  Component: (props) => {
    return (
      <>
        <input
          onChange={(event) => props.updateState({ ethValue: parseFloat(event.target.value) })}
        />
        <button onClick={props.next} disabled={!props.ethValue}>
          next
        </button>
      </>
    )
  },
}

type Step2Required = {
  ethValue: number
  colPrice: number
}

type Step2Provided = {
  usdValue: number
}

const Step2: IStep<Step2Required, Step2Provided> = {
  Component: (props) => {
    return (
      <>
        {props.ethValue}
        <input
          onChange={(event) =>
            props.updateState({ usdValue: parseFloat(event.target.value) * props.colPrice })
          }
        />
      </>
    )
  },
}

export function Wizard() {
  const [state, updateState] = useState<Step1Required>({
    colPrice: 20,
  })
  const Thing = (
    <Flow
      {...state}
      steps={[Step1, Step2]}
      updateState={(stateAddition) => {
        updateState((s) => ({ ...s, stateAddition }))
      }}
    />
  )
  return Thing
}
