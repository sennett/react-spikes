import React, { useContext } from 'react'
import { AppContext, setupAppContext } from '../appContext'

export const appContext = React.createContext<AppContext>(setupAppContext())

export function useAppContext(): AppContext {
  const ac = useContext(appContext)
  if (!ac) {
    throw new Error("AppContext not available! useAppContext can't be used serverside")
  }
  return ac
}
