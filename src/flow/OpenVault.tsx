import { useState } from 'react'

export type GenericStepProps = {
  next?: () => void
  previous?: () => void
}

function Step1(props: GenericStepProps) {
  return (
    <>
      step 1<br />
      <button disabled={!props.previous} onClick={props.previous}>
        previous
      </button>
      <button disabled={!props.next} onClick={props.next}>
        next
      </button>
    </>
  )
}

function Step2(props: GenericStepProps) {
  return (
    <>
      step 2<br />
      <button disabled={!props.previous} onClick={props.previous}>
        previous
      </button>
      <button disabled={!props.next} onClick={props.next}>
        next
      </button>
    </>
  )
}

export function Flow(props: { steps: Array<React.FC<GenericStepProps>> }) {
  const [currentStep, setCurrentStep] = useState(0)
  function next() {
    setCurrentStep((currentStep) => currentStep + 1)
  }

  function previous() {
    setCurrentStep((currentStep) => currentStep - 1)
  }

  return (
    <>
      {props.steps[currentStep]({
        next: currentStep < props.steps.length - 1 ? next : undefined,
        previous: currentStep > 0 ? previous : undefined,
      })}
    </>
  )
}

export function OpenVault() {
  return <Flow steps={[Step1, Step2]} />
}
