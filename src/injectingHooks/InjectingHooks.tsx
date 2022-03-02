import { useCustomHook } from './customHook'

export function InjectingHooks() {
  const [state, setState] = useCustomHook()
  return <button onClick={() => setState((s) => s + 1)}>hello {state}</button>
}
