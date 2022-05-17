import { useObservable } from '../stateMachineExperiment/helpers/useObservable'
import RenderStep from './RenderStep'
import presenter from './presenter'

const viewModal$ = presenter()

export default function JamesRiffExperiment() {
  const vm = useObservable(viewModal$)

  if (vm) {
    return <RenderStep step={vm.currentStep} progress={vm.progress} regress={vm.regress} />
  } else {
    return <>initialising</>
  }
}
