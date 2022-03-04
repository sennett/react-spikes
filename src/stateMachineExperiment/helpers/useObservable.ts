import { Observable } from 'rxjs'
import { useEffect, useState } from 'react'

export function useObservable<T>(obs: Observable<T>): T | undefined {
  const [state, setState] = useState<T | undefined>(undefined)

  useEffect(() => {
    const subscription = obs.subscribe({ next: (state) => setState(state) })
    return () => subscription.unsubscribe()
  }, [obs])

  return state
}