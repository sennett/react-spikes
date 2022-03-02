import { useViewFacade } from './useViewFacade'

export function AbstractProxyActions() {
  const [{ stage, amountDeposited }, updateDepositAmount] = useViewFacade()
  return (
    <>
      hello. {stage} | {amountDeposited}
      <br />
      <input onChange={(event) => updateDepositAmount(event.target.value)} />
    </>
  )
}
