import { useState, FC, ReactNode } from 'react'

export function Flow<S>(
  props: { steps: Array<IBaseStep> } & {
    next?: () => void
    previous?: () => void
    name: string
    updateState: (s: any) => void
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

  return (
    <>
      {props.steps.map((step, index) => {
        if (index === currentStepIndex) {
          return <step.Component {...props} next={next} previous={previous} key={index} />
        } else {
          return (
            <Hide key={index}>
              <step.Component {...props} next={next} previous={previous} />
            </Hide>
          )
        }
      })}
    </>
  )
}

function Hide(props: { children: ReactNode }) {
  // style={{ visibility: hiddenIf() ? 'hidden' : 'visible', maxHeight: hiddenIf() ? 0 : 'initial' }}
  return <div style={{ display: 'none' }}>{props.children}</div>
}

export type GenericStepProps<StepSpecificProps> = {
  next?: () => void
  previous?: () => void
  updateState: (s: any) => void
} & StepSpecificProps

interface IBaseStep {
  Component: FC<any>
}

export interface IStep<StepSpecificProps> extends IBaseStep {
  Component: FC<GenericStepProps<StepSpecificProps>>
}

function isSkippable<StepSpecificProps>(
  step: IStep<StepSpecificProps> | ISkippableStep<StepSpecificProps>,
): step is ISkippableStep<StepSpecificProps> {
  return (step as ISkippableStep<StepSpecificProps>).canSkip !== undefined
}

export interface ISkippableStep<StepSpecificProps> extends IStep<StepSpecificProps> {
  canSkip: (s: StepSpecificProps) => boolean
}
