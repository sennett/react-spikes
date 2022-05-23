import { IStep } from '../../Flow'

export type DoneProps = {}

export const Done: IStep<DoneProps> = {
  Component: (props) => {
    return (
      <>
        Allowance created
        <br />
        <button onClick={props.next}>next</button>
      </>
    )
  },
}
