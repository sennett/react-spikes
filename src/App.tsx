import React from 'react'
import './App.css'
import { InjectingHooks } from './injectingHooks/InjectingHooks'
import { FlexReactSelect } from './FlexReactSelect'
import { of } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { OpenVault } from './stateMachineExperiment/OpenVault'

function App() {
  return (
    <div className="App">
      {/*<h1>Injecting hooks</h1>*/}
      {/*<InjectingHooks />*/}
      {/*<h1>Flex react select</h1>*/}
      {/*<FlexReactSelect />*/}
      <h1>Proxy actions provider</h1>
      <OpenVault />
    </div>
  )
}

export default App
