import { useState, FC } from 'react'

export type GenericStepProps<S> = {
  next?: () => void
  previous?: () => void
  updateState: (s: Partial<S>) => void
  skip?: () => void
} & S

type Direction = 'forwards' | 'backwards'

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
  const [direction, setDirection] = useState<Direction>('forwards')

  const next =
    currentStep < props.steps.length - 1
      ? () => {
          setDirection('forwards')
          setCurrentStep((currentStep) => currentStep + 1)
        }
      : parentNext
      ? parentNext
      : undefined

  const previous =
    currentStep > 0
      ? () => {
          setDirection('backwards')
          setCurrentStep((currentStep) => currentStep - 1)
        }
      : parentPrevious
      ? parentPrevious
      : undefined

  const skip = direction === 'forwards' ? next : previous

  const CurrentStep = props.steps[currentStep]

  return (
    <>
      <CurrentStep {...props} next={next} previous={previous} skip={skip} />
    </>
  )
}
