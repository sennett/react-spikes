import { IStep } from '../../Flow'

export type DoneProps = {}

export const Done: IStep<void, void> = {
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
