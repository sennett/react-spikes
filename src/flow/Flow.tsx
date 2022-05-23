import { useState, FC } from 'react'

type FlowPropsBaseType<BigDaddyViewState> = {
  updateState: (state: string) => void
  // updateState: (state: BigDaddyViewState extends infer T ? T : never) => void
  next?: () => void
  previous?: () => void
  name: string
} & BigDaddyViewState

export function Flow<BigDaddyViewState, A, B>(
  props: {
    steps: [IStep<A, B>]
  } & FlowPropsBaseType<BigDaddyViewState>,
): JSX.Element
export function Flow<BigDaddyViewState, A, B, C>(
  props: {
    steps: [IStep<A, B>, IStep<A & B, C>]
  } & FlowPropsBaseType<BigDaddyViewState>,
): JSX.Element
export function Flow<BigDaddyViewState, A, B, C, D>(
  props: {
    steps: [IStep<A, B>, IStep<A & B, C>, IStep<A & B & C, D>]
  } & FlowPropsBaseType<BigDaddyViewState>,
): JSX.Element
export function Flow<BigDaddyViewState, A, B, C, D, E>(
  props: {
    steps: [IStep<A, B>, IStep<A & B, C>, IStep<A & B & C, D>, IStep<A & B & C & D, E>]
  } & FlowPropsBaseType<BigDaddyViewState>,
): JSX.Element
export function Flow<BigDaddyViewState, A, B, C, D, E, F>(
  props: {
    steps: [IStep<A, B>, IStep<A & B, C>, IStep<A & B & C, D>, IStep<A & B & C & D & E, F>]
  } & FlowPropsBaseType<BigDaddyViewState>,
): JSX.Element
export function Flow<BigDaddyViewState, A, B, C, D, E, F, G>(
  props: {
    steps: [IStep<A, B>, IStep<A & B, C>, IStep<A & B & C, D>, IStep<A & B & C & D & E & G, G>]
  } & FlowPropsBaseType<BigDaddyViewState>,
): JSX.Element
export function Flow<BigDaddyViewState>(
  props: { steps: Array<IStep<any, any>> } & {
    updateState: (state: any) => void
    next?: () => void
    previous?: () => void
    name: string
  } & BigDaddyViewState,
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

  const next = potentialNextStep
    ? () => setCurrentStepIndex(potentialNextStepIndex)
    : parentNext
    ? parentNext
    : undefined

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
    ? parentPrevious
    : undefined

  const currentStep = props.steps[currentStepIndex]

  return <currentStep.Component {...props} next={next} previous={previous} />
}

function isSkippable<StateRequired, StateProvided>(
  step: IStep<StateRequired, StateProvided> | ISkippableStep<StateRequired, StateProvided>,
): step is ISkippableStep<StateRequired, StateProvided> {
  return (step as ISkippableStep<StateRequired, StateProvided>).canSkip !== undefined
}

export interface IStep<StateRequired, StateProvided> {
  Component: FC<
    {
      next?: () => void
      previous?: () => void
      updateState: (s: StateProvided) => void
    } & StateRequired
  >
}

export interface ISkippableStep<StateRequired, StateProvided>
  extends IStep<StateRequired, StateProvided> {
  canSkip: (s: StateRequired) => boolean
}
