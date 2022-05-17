import { useState } from 'react'

export type GenericStepProps<S> = {
  next?: () => void
  previous?: () => void
  updateState: (s: Partial<S>) => void
} & S

export function Flow<S>(
  props: { steps: Array<React.FC<GenericStepProps<S>>> } & {
    updateState: (state: Partial<S>) => void
  } & S,
) {
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
        ...props,
        updateState: props.updateState,
        next: currentStep < props.steps.length - 1 ? next : undefined,
        previous: currentStep > 0 ? previous : undefined,
      })}
    </>
  )
}
