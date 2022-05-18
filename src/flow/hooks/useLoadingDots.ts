import { useEffect, useState } from 'react'

export function useLoadingDots() {
  const [dots, setDots] = useState(2)
  useEffect(() => {
    const i = setInterval(() => {
      setDots((d) => {
        if (d === 2) return 3
        if (d === 3) return 4
        return 2
      })
    }, 100)
    return () => clearInterval(i)
  })
  return Array(dots).join('.')
}
