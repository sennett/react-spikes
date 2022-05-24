import { delay, of } from 'rxjs'

export function createVault$(proxyAddress: string, depositAmount: number) {
  return of({ vaultId: 12345 }).pipe(delay(3000))
}
