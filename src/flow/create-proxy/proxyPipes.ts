import { delay, Observable, of } from 'rxjs'
import { params } from '../urlParams'

// @ts-ignore
let fakeProxyAddress: string = params.proxy_address

export function createProxy$(walletAddress: string): Observable<string> {
  fakeProxyAddress = '0xProxyAdress'
  return of(fakeProxyAddress).pipe(delay(1000))
}

export function getProxy$(walletAddress: string): Observable<string | undefined> {
  return of(fakeProxyAddress).pipe(delay(1000))
}
