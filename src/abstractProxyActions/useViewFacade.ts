import { createInitialState, SessionState, SessionStore, Stages } from './store'
import { useEffect, useState } from 'react'
import { SessionQuery } from './query'

export function useViewFacade(): [SessionState, Function] {
  // values
  const [state, setState] = useState<SessionState>(createInitialState())

  // handlers
  const [updateDepositAmount, setUpdateDepositAmount] = useState<(da: string) => void>(
    function () {},
  )

  useEffect(() => {
    const store = new SessionStore()
    const query = new SessionQuery(store)
    const querySubs = [query.state$.subscribe(setState)]
    setUpdateDepositAmount(
      () => (da: string) =>
        store.update((state) => ({
          ...state,
          amountDeposited: da,
        })),
    )
    return () => {
      store.destroy()
      querySubs.forEach((qs) => qs.unsubscribe())
    }
  }, [])

  return [state, updateDepositAmount]
}
