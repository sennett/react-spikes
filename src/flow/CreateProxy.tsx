import { GenericStepProps } from './Flow'
import { useState } from 'react'
import { useLoadingDots } from './useLoadingDots'

export type CreateProxyProps = {
  walletAddress: string
  depositAmountUsd?: number
  proxyAddress?: string
}

type ProxyCreationStatus = 'not-started' | 'creating' | 'done'

export function CreateProxy(props: GenericStepProps<CreateProxyProps>) {
  const [proxyCreationStatus, setProxyCreationStatus] = useState<ProxyCreationStatus>('not-started')
  const dots = useLoadingDots()

  function createProxy() {
    setProxyCreationStatus('creating')
    setTimeout(() => setProxyCreationStatus('done'), 3000)
  }

  return (
    <>
      Create proxy
      <br />
      Deposit amount: ({props.depositAmountUsd} USD)
      <br />
      {proxyCreationStatus === 'not-started' && (
        <>Create a proxy for wallet at address {props.walletAddress}</>
      )}
      {proxyCreationStatus === 'creating' && Array(dots).join('.')}
      {proxyCreationStatus === 'done' && `Proxy done!`}
      <br />
      <button disabled={!props.previous} onClick={props.previous}>
        back
      </button>
      {proxyCreationStatus !== 'done' && (
        <button disabled={proxyCreationStatus !== 'not-started'} onClick={createProxy}>
          create proxy
        </button>
      )}
      {proxyCreationStatus === 'done' && (
        <button
          disabled={proxyCreationStatus !== 'done' || !props.next}
          onClick={proxyCreationStatus === 'done' ? props.next : createProxy}
        >
          next
        </button>
      )}
    </>
  )
}
