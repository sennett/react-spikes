import { useState, FC } from 'react'

export type GenericStepProps<S> = {
  next?: () => void
  previous?: () => void
  updateState: (s: Partial<S>) => void
  skip?: () => void
} & S

type Direction = 'forwards' | 'backwards'

export function Flow<S>(
  props: { steps: Array<IStep<GenericStepProps<S>>> } & {
    updateState: (state: Partial<S>) => void
    next?: () => void
    previous?: () => void
    name: string
  } & S,
) {
  const parentPrevious = props.previous
  const parentNext = props.next

  let nextPreviousCalledThisRender = false
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('forwards')

  const isNestedFlow = parentPrevious || parentNext
  const canProgress = currentStepIndex < props.steps.length - 1
  const canRegress = currentStepIndex > 0

  const next = canProgress
    ? () => {
        nextPreviousCalledThisRender = true
        setDirection('forwards')
        setCurrentStepIndex((currentStep) => currentStep + 1)
      }
    : isNestedFlow
    ? parentNext
    : undefined

  const previous = canRegress
    ? () => {
        nextPreviousCalledThisRender = true
        setDirection('backwards')
        setCurrentStepIndex((currentStep) => currentStep - 1)
      }
    : isNestedFlow
    ? parentPrevious
    : undefined

  const skip = direction === 'forwards' ? next : previous

  const currentStep = props.steps[currentStepIndex]

  if (
    nextPreviousCalledThisRender &&
    isSkippable(currentStep) &&
    skip &&
    currentStep.canSkip(props)
  ) {
    console.log(`skipping step with index ${currentStepIndex} in flow ${props.name}`)
    skip()
  }

  return <currentStep.Component {...props} next={next} previous={previous} skip={skip} />
}

function isSkippable<T>(step: IStep<T> | ISkippableStep<T>): step is ISkippableStep<T> {
  return (step as ISkippableStep<T>).canSkip !== undefined
}

export interface IStep<StepSpecificProps> {
  Component: FC<GenericStepProps<StepSpecificProps>>
}

export interface ISkippableStep<StepSpecificProps> extends IStep<StepSpecificProps> {
  canSkip: (s: StepSpecificProps) => boolean
}
