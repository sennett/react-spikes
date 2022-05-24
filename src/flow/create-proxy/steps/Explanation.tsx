import { IStep } from '../../Flow'
import { useLoadingDots } from '../../hooks/useLoadingDots'
import { useState } from 'react'
import { createProxy$ } from '../proxyPipes'

export type ExplanationProps = {
  walletAddress: string
  proxyAddress?: string
}

export const Explanation: IStep<ExplanationProps> = {
  Component: (props) => {
    const [creatingProxy, setCreatingProxy] = useState(false)
    const dots = useLoadingDots()

    function createProxy() {
      setCreatingProxy(true)
      createProxy$(props.walletAddress).subscribe({
        next: (proxyAddress: string) => {
          props.updateState!({ proxyAddress: proxyAddress })
          props.next!()
        },
      })
    }

    if (!creatingProxy) {
      return (
        <>
          Create proxy
          <br />
          With your smart proxy multiple actions can be performed in one transaction for your Vault.
          This proxy only needs to be set up once. Read more in the Knowledge Base
          <br />
          Create a proxy for wallet at address {props.walletAddress}
          <br />
          <button disabled={!props.previous} onClick={props.previous}>
            previous
          </button>
          <button disabled={!props.next} onClick={createProxy}>
            next
          </button>
        </>
      )
    } else {
      return (
        <>
          Creating proxy...
          <br />
          {dots}
        </>
      )
    }
  },
}
