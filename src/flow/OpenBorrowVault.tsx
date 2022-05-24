import { Flow } from './Flow'
import { useEffect, useState } from 'react'
import { SimulateStep, SimulateStepProps } from './steps/SimulateStep'
import { CreateProxy, CreateProxyProps } from './create-proxy/CreateProxy'
import { Confirmation, ConfirmationProps } from './steps/Confirmation'
import { Complete, CompleteProps } from './steps/Complete'
import { Allowance } from './allowance/Allowance'
import { useAppContext } from './hooks/useAppContext'

type OpenBorrowVaultType = SimulateStepProps & CreateProxyProps & ConfirmationProps & CompleteProps

// ensures we can only update state that exists
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

export function OpenBorrowVault() {
  const [viewState, setViewState] = useState<OpenBorrowVaultType>({
    ethPrice: 2000,
    walletAddress: '0xWalletAddress',
  })
  const { ethPrice$ } = useAppContext()

  function spreadViewState(stateUpdate: AtLeastOne<OpenBorrowVaultType>) {
    setViewState((currentState) => ({ ...currentState, ...stateUpdate }))
  }

  useEffect(() => {
    const subsn = ethPrice$.subscribe({
      next: (ethPrice) => spreadViewState({ ...ethPrice }),
    })
    return () => subsn.unsubscribe()
  })

  return (
    <>
      <div style={{ border: 'solid 1px', padding: '10px', maxWidth: '400px', margin: 'auto' }}>
        <Flow<OpenBorrowVaultType>
          name="open vault"
          steps={[SimulateStep, CreateProxy, Allowance, Confirmation, Complete]}
          {...viewState}
          updateState={spreadViewState}
        />
      </div>
      <pre style={{ textAlign: 'left' }}>{JSON.stringify(viewState, null, 2)}</pre>
      <br />
      <a href="/">Simulate user starting with nothing</a>
      <br />
      <a href="/?proxy_address=hello">Simulate preexisting DS proxy</a>
      <br />
      <a href="/?proxy_address=hello&allowance=1000">Simulate preexisting big allowance</a>
      <br />
      <a href="/?proxy_address=hello&allowance=2">Simulate preexisting small allowance</a>
      <br />
      <a href="/?proxy_address=hello&allowance=1000">
        Simulate preexisting DS proxy and big allowance
      </a>
    </>
  )
}
