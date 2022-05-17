import { Wizard } from './Wizard'
import { Observable, of, shareReplay, tap } from 'rxjs'

export class Step {
  name: string
  _wizard: Wizard

  constructor(wizard: Wizard, name: string) {
    this.name = name
    this._wizard = wizard

    this.progress$ = of(() => {
      // this._wizard.progress$.next()
    }).pipe(shareReplay(1))

    this.regress$ = of(() => {
      // this._wizard.regress$.next()
    }).pipe(shareReplay(1))
  }

  progress$: Observable<(() => void) | undefined>
  regress$: Observable<(() => void) | undefined>
}
