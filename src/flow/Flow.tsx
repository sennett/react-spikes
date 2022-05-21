import { useState, FC } from 'react'
import { Observable } from 'rxjs'
import { useObservable } from '../stateMachineExperiment/helpers/useObservable'

export type GenericStepProps<S> = {
  next?: () => void
  previous?: () => void
  updateState: (s: Partial<S>) => void
  skip?: () => void
  state$: Observable<S>
} & S

type Direction = 'forwards' | 'backwards'

export function Flow<S>(
  props: { steps: Array<IStep<S>> } & {
    updateState: (state: Partial<S>) => void
    next?: () => void
    previous?: () => void
    name: string
    state$: Observable<S>
  } & S,
) {
  const parentPrevious = props.previous
  const parentNext = props.next

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentStep = props.steps[currentStepIndex]
  const canSkip = useObservable(currentStep.canSkip$(props.state$))

  const [direction, setDirection] = useState<Direction>('forwards')

  const isNestedFlow = parentPrevious || parentNext
  const canProgress = currentStepIndex < props.steps.length - 1
  const canRegress = currentStepIndex > 0

  const next = canProgress
    ? () => {
        setDirection('forwards')
        setCurrentStepIndex((currentStep) => currentStep + 1)
      }
    : isNestedFlow
    ? parentNext
    : undefined

  const previous = canRegress
    ? () => {
        setDirection('backwards')
        setCurrentStepIndex((currentStep) => currentStep - 1)
      }
    : isNestedFlow
    ? parentPrevious
    : undefined

  const skip = direction === 'forwards' ? next : previous

  if (skip && canSkip) {
    console.log(`skipping step with index ${currentStepIndex} in flow ${props.name}`)
    skip()
  }

  return <currentStep.Component {...props} next={next} previous={previous} skip={skip} />
}

export interface IStep<StepSpecificProps> {
  Component: FC<GenericStepProps<StepSpecificProps>>
  canSkip$: (state$: Observable<StepSpecificProps>) => Observable<boolean>
}
