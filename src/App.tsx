import React, { useState } from 'react'
import './App.css'
import { OpenBorrowVault } from './flow/OpenBorrowVault'

function App() {
  // const [s, ss] = useState<Type>({ one: 'hello' })
  return (
    <div className="App">
      {/*<h1>Injecting hooks</h1>*/}
      {/*<InjectingHooks />*/}
      {/*<h1>Flex react select</h1>*/}
      {/*<FlexReactSelect />*/}
      {/*<h1>State machine experiment</h1>*/}
      {/*<OpenBorrowVault />*/}
      {/*<h1>james riff experiment</h1>*/}
      {/*<JamesRiffExperiment />*/}
      <h1>Flow</h1>
      <OpenBorrowVault />
      {/*<h1>FLow debug</h1>*/}
      {/*<Flow<Type>*/}
      {/*  name="new flow"*/}
      {/*  {...s}*/}
      {/*  steps={[Step1]}*/}
      {/*  updateState={(ns) => ss((os) => ({ ...os, ...ns }))}*/}
      {/*/>*/}
    </div>
  )
}

export default App
