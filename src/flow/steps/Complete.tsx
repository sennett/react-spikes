import { GenericStepProps, IStep } from '../Flow'

export type CompleteProps = {
  vaultId?: number
}

export const Complete: IStep<CompleteProps> = {
  Component: (props: GenericStepProps<CompleteProps>) => {
    function goToVault() {
      alert(`heading to vault #${props.vaultId}`)
    }
    return (
      <>
        Complete
        <br />
        <button onClick={goToVault}>Go to vault #{props.vaultId}</button>
      </>
    )
  },
  displayName: 'Complete',
}
