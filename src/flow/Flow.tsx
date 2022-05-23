import { useState, FC } from 'react'

export function Flow<S>(
  props: { steps: Array<IStep<S>> } & {
    updateState: (state: Partial<S>) => void
    next?: () => void
    previous?: () => void
    name: string
  } & S,
) {
  const parentPrevious = props.previous
  const parentNext = props.next

  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // calculate next step
  let potentialNextStepIndex = currentStepIndex + 1
  let potentialNextStep = props.steps[potentialNextStepIndex]

  while (potentialNextStep && isSkippable(potentialNextStep) && potentialNextStep.canSkip(props)) {
    potentialNextStepIndex = potentialNextStepIndex + 1
    potentialNextStep = props.steps[potentialNextStepIndex]
  }

  const next = potentialNextStep ? () => setCurrentStepIndex(potentialNextStepIndex) : parentNext

  // calculate previous step
  let potentialPreviousStepIndex = currentStepIndex - 1
  let potentialPreviousStep = props.steps[potentialPreviousStepIndex]

  while (
    potentialPreviousStep &&
    isSkippable(potentialPreviousStep) &&
    potentialPreviousStep.canSkip(props)
  ) {
    potentialPreviousStepIndex = potentialPreviousStepIndex - 1
    potentialPreviousStep = props.steps[potentialPreviousStepIndex]
  }

  const previous = potentialPreviousStep
    ? () => setCurrentStepIndex(potentialPreviousStepIndex)
    : parentPrevious

  const currentStep = props.steps[currentStepIndex]

  return <currentStep.Component {...props} next={next} previous={previous} />
}

function isSkippable<T>(step: IStep<T> | ISkippableStep<T>): step is ISkippableStep<T> {
  return (step as ISkippableStep<T>).canSkip !== undefined
}

export interface IStep<StepSpecificProps> {
  Component: FC<
    StepSpecificProps & {
      next?: () => void
      previous?: () => void
      updateState: (s: Partial<StepSpecificProps>) => void
    }
  >
}

export interface ISkippableStep<StepSpecificProps> extends IStep<StepSpecificProps> {
  canSkip: (s: StepSpecificProps) => boolean
}
