import { GenericStepProps, IStep } from '../../Flow'

export type DoneProps = {}

export const Done: IStep<DoneProps> = {
  Component: (props: GenericStepProps<DoneProps>) => {
    return (
      <>
        Allowance created
        <br />
        <button onClick={props.next}>next</button>
      </>
    )
  },
}
