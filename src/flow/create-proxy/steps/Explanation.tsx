import { GenericStepProps } from '../../Flow'

export type ExplanationProps = {
  walletAddress: string
}

export function Explanation(props: GenericStepProps<ExplanationProps>) {
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
      <button disabled={!props.next} onClick={props.next}>
        next
      </button>
    </>
  )
}
