import { Query } from '@datorama/akita'
import { SessionState, SessionStore } from './store'

export class SessionQuery extends Query<SessionState> {
  state$ = this.select()

  constructor(protected store: SessionStore) {
    super(store)
  }
}
