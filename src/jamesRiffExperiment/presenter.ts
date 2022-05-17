import { combineLatest, Observable, of, switchMap } from 'rxjs'
import { Step } from './Step'
import { Wizard } from './Wizard'
import { map } from 'rxjs/operators'

type WizardViewModel = {
  currentStep: Step
  progress: (() => void) | undefined
  regress: (() => void) | undefined
}

export default function presenter(): Observable<WizardViewModel> {
  const wizard = new Wizard()

  return wizard.currentStep$.pipe(
    switchMap((step) => {
      return combineLatest([step.progress$, step.regress$, of(step)])
    }),
    map(([progress, regress, step]) => ({
      currentStep: step,
      progress,
      regress,
    })),
  )
}
