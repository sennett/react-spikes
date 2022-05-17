import { Step } from './Step'

export default function RenderStep(props: {
  step: Step
  progress: (() => void) | undefined
  regress: (() => void) | undefined
}) {
  const { step, regress, progress } = props

  return (
    <>
      {step.name}
      <br />
      <button disabled={!regress} onClick={regress}>
        previous
      </button>
      <button disabled={!progress} onClick={progress}>
        next
      </button>
    </>
  )
}
