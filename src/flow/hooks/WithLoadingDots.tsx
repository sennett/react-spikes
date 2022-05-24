import { useLoadingDots } from './useLoadingDots'
import { ReactElement, ReactNode } from 'react'

export function WithLoadingDots<T>(props: {
  value: T | undefined
  children: (p: T) => ReactElement
}) {
  const dots = useLoadingDots()
  return props.value ? props.children(props.value) : <>{dots}</>
}
