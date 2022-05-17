import { GenericStepProps } from '../../Flow'

export type DoneProps = {
  proxyAddress?: string
}

export function Done(props: GenericStepProps<DoneProps>) {
  return (
    <>
      Proxy created
      <br />
      Address: {props.proxyAddress} <br />
      <button onClick={props.next}>onwards</button>
    </>
  )
}
