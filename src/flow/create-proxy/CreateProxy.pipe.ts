import {
  Subject,
  from,
  combineLatest,
  map,
  switchMap,
  share,
  startWith,
  Observable,
  merge,
  of,
} from 'rxjs'

type ConnectedContext = {
  account: string
}

type ProxyAddress = (account: string) => Observable<string>

function createDsProxy(account: string) {
  return '0xProxyAdress'
}

// TODO: Think about how AppContext could be tidied up
function createProxyPipe$(
  context$: Observable<ConnectedContext>,
  proxyAddress$: Observable<ProxyAddress>,
): Observable<{ createProxy: any; proxy: any }> {
  const createProxyClick$ = new Subject<void>()

  const newProxy$ = combineLatest([createProxyClick$, context$]).pipe(
    switchMap(([_, context]) => from(createDsProxy(context.account))),
    share(),
    startWith(undefined),
  )

  const existingProxy$ = combineLatest([context$, proxyAddress$]).pipe(
    switchMap(([context, proxyAddress]) => proxyAddress(context.account)),
    share(),
  )

  const proxy$ = merge(newProxy$, existingProxy$)

  function createProxy() {
    createProxyClick$.next()
  }

  // Return viewModel
  return combineLatest([of(createProxy), proxy$]).pipe(
    map(([createProxy, proxy]) => ({
      createProxy,
      proxy,
    })),
  )
}

export const proxy$ = createProxyPipe$(
  of({ account: '0xUserAdress' }),
  of((account: string) => of('OxProxyAddress')),
)
