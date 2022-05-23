import { useState, FC } from 'react'
import { merge, Observable, scan } from 'rxjs'
import { useObservable } from '../stateMachineExperiment/helpers/useObservable'

export function Flow<S>(
  props: { steps: Array<IBaseStep> } & {
    next?: () => void
    previous?: () => void
    name: string
    captureStateChange: (observable$: Observable<any>) => void
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

  // subscribe to step updates
  const state$ = merge(
    props.steps.filter(providesState).map(({ updateState$ }) => updateState$),
  ).pipe(
    scan((acc, cur) => {
      return { ...acc, ...cur }
    }, {}),
  )

  const state = useObservable(state$)

  const currentStep = props.steps[currentStepIndex]

  return <currentStep.Component {...props} {...state} next={next} previous={previous} />
}

export type GenericStepProps<StepSpecificProps> = {
  next?: () => void
  previous?: () => void
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

function providesState<StepSpecificProps, StateFromStep>(
  step: IStep<StepSpecificProps> | IStateProviderStep<StepSpecificProps, StateFromStep>,
): step is IStateProviderStep<StepSpecificProps, StateFromStep> {
  return (step as IStateProviderStep<StepSpecificProps, StateFromStep>).updateState$ !== undefined
}

export interface IStateProviderStep<StepSpecificProps, StateFromStep>
  extends IStep<StepSpecificProps> {
  updateState$: Observable<StateFromStep>
}
