import { Flow } from './Flow'
import { useEffect, useState } from 'react'
import { SimulateStep, SimulateStepProps } from './steps/SimulateStep'
import { CreateProxy, CreateProxyProps } from './create-proxy/CreateProxy'
import { Confirmation, ConfirmationProps } from './steps/Confirmation'
import { Complete, CompleteProps } from './steps/Complete'
import { Allowance } from './allowance/Allowance'

type OpenBorrowVaultType = SimulateStepProps & CreateProxyProps & ConfirmationProps & CompleteProps

function calculateViewModal(state: OpenBorrowVaultType): OpenBorrowVaultType {
  return {
    ...state,
    depositAmountUsd: state.depositAmount && state.depositAmount * state.ethPrice,
  }
}

export function OpenBorrowVault() {
  const [viewState, setViewState] = useState<OpenBorrowVaultType>({
    ethPrice: 2000,
    walletAddress: '0xWalletAddress',
  })

  useEffect(() => {
    const i = setInterval(() => {
      setViewState((oldState) => {
        return calculateViewModal({ ...oldState, ethPrice: Math.floor(Math.random() * 10000) })
      })
    }, 10000)
    return () => clearInterval(i)
  })

  return (
    <Flow<OpenBorrowVaultType>
      name="open vault"
      steps={[SimulateStep, CreateProxy, Allowance, Confirmation, Complete]}
      {...viewState}
      updateState={(newState) =>
        setViewState((oldState) => calculateViewModal({ ...oldState, ...newState }))
      }
    />
  )
}
