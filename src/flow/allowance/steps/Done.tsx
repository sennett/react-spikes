import { GenericStepProps } from '../../Flow'

export type DoneProps = {}

export function Done(props: GenericStepProps<DoneProps>) {
  return (
    <>
      Allowance created
      <br />
      <button onClick={props.next}>next</button>
    </>
  )
}
