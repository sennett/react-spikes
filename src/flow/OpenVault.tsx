import { Flow } from './Flow'
import { useEffect, useState } from 'react'
import { SimulateStep, SimulateStepProps } from './steps/SimulateStep'
import { CreateProxy, CreateProxyProps } from './CreateProxy'
import { Confirmation, ConfirmationProps } from './steps/Confirmation'
import { Complete, CompleteProps } from './steps/Complete'

type OpenVaultType = SimulateStepProps & CreateProxyProps & ConfirmationProps & CompleteProps

function calculateViewModal(state: OpenVaultType): OpenVaultType {
  return {
    ...state,
    depositAmountUsd: state.depositAmount && state.depositAmount * state.ethPrice,
  }
}

export function OpenVault() {
  const [viewState, setViewState] = useState<OpenVaultType>({
    ethPrice: 2000,
    walletAddress: '0xWalletAddress',
  })

  useEffect(() => {
    const i = setInterval(() => {
      setViewState((oldState) => {
        return calculateViewModal({ ...oldState, ethPrice: Math.floor(Math.random() * 10000) })
      })
    }, 1000)
    return () => clearInterval(i)
  })

  return (
    <Flow<OpenVaultType>
      steps={[SimulateStep, CreateProxy, Confirmation, Complete]}
      {...viewState}
      updateState={(newState) =>
        setViewState((oldState) => calculateViewModal({ ...oldState, ...newState }))
      }
    />
  )
}
