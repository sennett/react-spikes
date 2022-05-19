import { useEffect, useState } from 'react'

export function useSkip(skip: (() => void) | undefined, dependencies: unknown[]) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (skip && dependencies.every((dep) => !!dep)) {
      skip()
    }
    setLoading(false)
  }, [skip, dependencies])

  return loading
}
