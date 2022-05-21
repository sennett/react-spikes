import { Observable, of } from 'rxjs'
import { GenericStepProps, IStep } from '../../Flow'

export type DoneProps = {
  walletAddress: string
  proxyAddress?: string
}

export const Done: IStep<DoneProps> = {
  Component: (props: GenericStepProps<DoneProps>) => {
    return (
      <>
        Proxy created
        <br />
        Address: {props.proxyAddress} <br />
        <button onClick={props.next}>onwards</button>
      </>
    )
  },
  canSkip$: (): Observable<boolean> => {
    return of(false)
  },
}
