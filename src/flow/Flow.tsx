import React from 'react'
import { useState, FC, useMemo } from 'react'

export type GenericStepProps<S> = {
  next?: () => void
  previous?: () => void
  updateState: (s: Partial<S>) => void
  hidden?: boolean
} & S

// TODO: Switch to rendering all steps and using CSS to hide/display
// TODO: Think about state and canSkip

export function Flow<S>(
  props: { steps: Array<IStep<GenericStepProps<S>>> } & {
    updateState: (state: Partial<S>) => void
    next?: () => void
    previous?: () => void
    name: string
    hidden?: boolean
  } & S,
) {
  const parentPrevious = props.previous
  const parentNext = props.next

  // let nextPreviousCalledThisRender = false
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // calculate next step
  let potentialNextStepIndex = currentStepIndex + 1
  let potentialNextStep = props.steps[potentialNextStepIndex]

  while (potentialNextStep && isSkippable(potentialNextStep) && potentialNextStep.canSkip(props)) {
    potentialNextStepIndex = potentialNextStepIndex + 1
    potentialNextStep = props.steps[potentialNextStepIndex]
  }

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

  const isNestedFlow = parentPrevious || parentNext

  const getNext = (stepIndex: number) => {
    const canProgress = stepIndex === currentStepIndex && currentStepIndex < props.steps.length - 1
    const next = canProgress
      ? () => setCurrentStepIndex(potentialNextStepIndex)
      : isNestedFlow
      ? parentNext
      : undefined

    return next
  }

  const getPrevious = (stepIndex: number) => {
    const canRegress = stepIndex === currentStepIndex && currentStepIndex > 0

    const previous = canRegress
      ? () => setCurrentStepIndex(potentialPreviousStepIndex)
      : isNestedFlow
      ? parentPrevious
      : undefined

    return previous
  }

  return (
    <>
      {props.steps.map((Step, stepIndex) => {
        const hideStep = stepIndex !== currentStepIndex

        const next = getNext(stepIndex)
        const previous = getPrevious(stepIndex)

        return (
          <Hidden
            key={`${Step.Component.displayName} - ${stepIndex}`}
            hiddenIf={() => props.hidden || hideStep}
          >
            <Step.Component
              {...props}
              next={next}
              previous={previous}
              hidden={props.hidden || hideStep}
            />
          </Hidden>
        )
      })}
    </>
  )
}

export const Hidden: React.FC<{
  hiddenIf: () => boolean
  children?: React.ReactNode
}> = ({ hiddenIf, children }) => (
  <div
    style={{ visibility: hiddenIf() ? 'hidden' : 'visible', maxHeight: hiddenIf() ? 0 : 'initial' }}
  >
    {children}
  </div>
)

function isSkippable<T>(step: IStep<T> | ISkippableStep<T>): step is ISkippableStep<T> {
  return (step as ISkippableStep<T>).canSkip !== undefined
}

export interface IStep<StepSpecificProps> {
  Component: FC<GenericStepProps<StepSpecificProps>>
  displayName: string
}

export interface ISkippableStep<StepSpecificProps> extends IStep<StepSpecificProps> {
  canSkip: (s: StepSpecificProps) => boolean
}
