import { Store, StoreConfig } from '@datorama/akita'

export enum Stages {
  AwaitingDeposit = 'AwaitingDeposit',
  AmountDeposited = 'AmountDeposited',
  AwaitingProxy = 'AwaitingProxy',
  ProxyConfirmed = 'ProxyConfirmed',
}

export interface SessionState {
  stage: Stages
  amountDeposited?: string
}

export function createInitialState(): SessionState {
  return {
    stage: Stages.AwaitingDeposit,
  }
}

@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(createInitialState())
  }
}
