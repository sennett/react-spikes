import { Step } from './Step'
import {
  mapTo,
  merge,
  Observable,
  of,
  scan,
  startWith,
  Subject,
  switchMap,
  combineLatest,
  iif,
} from 'rxjs'
import { map } from 'rxjs/operators'

export class Wizard {
  steps: Step[]
  currentStep$: Observable<Step>
  progress$: Observable<(() => void) | undefined>
  regress$: Observable<(() => void) | undefined>

  _currentStepIndex$: Observable<number>
  constructor() {
    this.steps = [new Step(this, 'step 1'), new Step(this, 'step 2')]

    const _currentStep$$: Subject<Observable<Step>> = new Subject<Observable<Step>>()

    this.progress$ = _currentStep$$.pipe(
      switchMap((cs$) => combineLatest([cs$, this._currentStepIndex$])),
      switchMap(([cs, csi]) => cs.progress$),
    )

    this.regress$ = _currentStep$$.pipe(
      switchMap((cs$) => combineLatest([cs$, this._currentStepIndex$])),
      switchMap(([cs, csi]) => cs.regress$),
    )

    this._currentStepIndex$ = merge(
      this.progress$.pipe(mapTo('progress')),
      this.regress$.pipe(mapTo('regress')),
    ).pipe(
      scan(
        (previousStepIndex, operation) =>
          operation === 'progress' ? previousStepIndex + 1 : previousStepIndex - 1,
        0,
      ),
      startWith(0),
    )

    this.currentStep$ = this._currentStepIndex$.pipe(map((i) => this.steps[i]))
    _currentStep$$.next(this.currentStep$)
  }
}
