import { IStep } from '../../Flow'

export type DoneProps = {
  proxyAddress: string
}

export const Done: IStep<DoneProps, DoneProps> = {
  Component: (props) => {
    return (
      <>
        Proxy created
        <br />
        Address: {props.proxyAddress} <br />
        <button onClick={props.next}>onwards</button>
      </>
    )
  },
}
