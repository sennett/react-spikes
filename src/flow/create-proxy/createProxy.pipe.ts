import { Observable, of } from 'rxjs'
import { CreateProxyViewState } from './createProxy.viewState'

const fakeProxyAddress = '0xProxyAdress'

export function getProxy$(walletAddress: string): Observable<CreateProxyViewState | undefined> {
  return of(undefined)
}
