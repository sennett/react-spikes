import { IStep } from '../Flow'
import { useState } from 'react'
import { useLoadingDots } from '../hooks/useLoadingDots'
import { createVault$ } from '../openVault.pipe'

export type ConfirmationProps = {
  depositAmount?: number
  depositAmountUsd?: number
  proxyAddress?: string
  vaultId?: number
}

type VaultCreationStatus = 'not-started' | 'in-progress' | 'done'

export const Confirmation: IStep<ConfirmationProps> = {
  Component: (props) => {
    const dots = useLoadingDots()
    const [vaultCreationStatus, setVaultCreationStatus] =
      useState<VaultCreationStatus>('not-started')

    function confirm() {
      setVaultCreationStatus('in-progress')
      if (props.proxyAddress && props.depositAmount) {
        createVault$(props.proxyAddress, props.depositAmount).subscribe({
          next: (vaultId) => {
            props.updateState!(vaultId)
            props.next!()
          },
        })
      }
    }

    return (
      <>
        Confirmation
        <br />
        Deposit amount: {props.depositAmount} ETH ({props.depositAmountUsd} USD)
        <br />
        {vaultCreationStatus === 'in-progress' && dots}
        <br />
        <button disabled={!props.previous} onClick={props.previous}>
          back
        </button>
        <button onClick={confirm} disabled={vaultCreationStatus !== 'not-started'}>
          create vault
        </button>
      </>
    )
  },
}
