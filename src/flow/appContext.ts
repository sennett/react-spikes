import { createProxy$, getProxy$ } from './create-proxy/proxyPipes'
import { interval } from 'rxjs'
import { map } from 'rxjs/operators'

const ethPrice$ = interval(3000).pipe(map(() => ({ ethPrice: Math.floor(Math.random() * 10000) })))

export function setupAppContext() {
  return { createProxy$, getProxy$, ethPrice$ }
}

export type AppContext = ReturnType<typeof setupAppContext>
