import { delay, Observable, of } from 'rxjs'
import { params } from '../urlParams'

// @ts-ignore
let fakeAllowance: number = parseInt(params.allowance)

export function createAllowance$(walletAddress: string, allowance: number): Observable<number> {
  fakeAllowance = allowance
  return of(allowance).pipe(delay(1000))
}

export function getAllowance$(walletAddress: string): Observable<number | undefined> {
  return of(fakeAllowance).pipe(delay(1000))
}
