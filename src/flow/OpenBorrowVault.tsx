import { Flow } from './Flow'
import { useEffect, useState } from 'react'
import { SimulateStep, SimulateStepProps } from './steps/SimulateStep'
import { CreateProxy, CreateProxyProps } from './create-proxy/CreateProxy'
import { Confirmation, ConfirmationProps } from './steps/Confirmation'
import { Complete, CompleteProps } from './steps/Complete'
import { Allowance } from './allowance/Allowance'
import { interval } from 'rxjs'
import { map } from 'rxjs/operators'

type OpenBorrowVaultType = SimulateStepProps & CreateProxyProps & ConfirmationProps & CompleteProps

function calculateViewModal(state: OpenBorrowVaultType): OpenBorrowVaultType {
  return {
    ...state,
    depositAmountUsd: state.depositAmount && state.depositAmount * state.ethPrice,
  }
}

export function OpenBorrowVault() {
  const viewState = {
    ethPrice: 2000,
    walletAddress: '0xWalletAddress',
  }

  // useEffect(() => {
  //   const i = setInterval(() => {
  //     setViewState((oldState) => {
  //       return calculateViewModal({ ...oldState, ethPrice: Math.floor(Math.random() * 10000) })
  //     })
  //   }, 1000)
  //   return () => clearInterval(i)
  // })

  return (
    <Flow<OpenBorrowVaultType>
      name="open vault"
      // steps={[SimulateStep(), CreateProxy, Allowance, Confirmation, Complete]}
      steps={[SimulateStep(), CreateProxy()]}
      {...viewState}
    />
  )
}
