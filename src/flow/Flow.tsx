import { useState, FC } from 'react'

export type GenericStepProps<S> = {
  next?: () => void
  previous?: () => void
  updateState: (s: Partial<S>) => void
} & S

export function Flow<S>(
  props: { steps: Array<FC<GenericStepProps<S>>> } & {
    updateState: (state: Partial<S>) => void
    next?: () => void
    previous?: () => void
    name: string
  } & S,
) {
  const parentPrevious = props.previous
  const parentNext = props.next

  const [currentStep, setCurrentStep] = useState(0)

  const next =
    currentStep < props.steps.length - 1
      ? () => setCurrentStep((currentStep) => currentStep + 1)
      : parentNext
      ? parentNext
      : undefined

  const previous =
    currentStep > 0
      ? () => setCurrentStep((currentStep) => currentStep - 1)
      : parentPrevious
      ? parentPrevious
      : undefined

  const CurrentStep = props.steps[currentStep]

  return (
    <>
      <CurrentStep {...props} next={next} previous={previous} />
    </>
  )
}
