import { GenericStepProps } from '../Flow'
import { useState } from 'react'
import { useLoadingDots } from '../hooks/useLoadingDots'

export type ConfirmationProps = {
  depositAmount?: number
  depositAmountUsd?: number
  proxyAddress?: string
  vaultId?: number
}

type VaultCreationStatus = 'not-started' | 'in-progress' | 'done'

export function Confirmation(props: GenericStepProps<ConfirmationProps>) {
  const dots = useLoadingDots()
  const [vaultCreationStatus, setVaultCreationStatus] = useState<VaultCreationStatus>('not-started')

  function confirm() {
    setVaultCreationStatus('in-progress')
    setTimeout(() => {
      setVaultCreationStatus('done')
      props.updateState({ vaultId: 34567 })
      props.next!()
    }, 5000)
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
}
