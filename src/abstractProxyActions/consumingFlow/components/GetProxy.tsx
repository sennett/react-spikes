import { useState } from 'react'

type GetProxyProps = {
  depositAmount: number
  confirmProxy: (address: string) => void
}

export function GetProxy(props: GetProxyProps) {
  const [proxyAddress, setProxyAddress] = useState<string>('')
  return (
    <>
      Deposit amount: {props.depositAmount}
      <input
        placeholder="Enter proxy address"
        onChange={(event) => setProxyAddress(event.target.value)}
      />
      <button disabled={!proxyAddress} onClick={() => props.confirmProxy(proxyAddress)}>
        Set up proxy
      </button>
    </>
  )
}
