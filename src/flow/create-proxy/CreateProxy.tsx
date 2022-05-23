import { Flow, GenericStepProps, ISkippableStep, IStateProviderStep } from '../Flow'
import { FC, useState } from 'react'
import { Explanation, ExplanationProps } from './steps/Explanation'
import { Creation, StepProps } from './steps/Creation'
import { Done, DoneProps } from './steps/Done'
import { SimulateStepProps } from '../steps/SimulateStep'
import { Observable, Subject } from 'rxjs'

export type CreateProxyProps = ExplanationProps & StepProps & DoneProps

export type ProxyCreated = {
  proxyAddress: string
}

export function CreateProxy(): IStateProviderStep<CreateProxyProps, ProxyCreated> &
  ISkippableStep<CreateProxyProps> {
  const updateState$ = new Subject<ProxyCreated>()
  return {
    updateState$,
    Component: (props: GenericStepProps<CreateProxyProps>) => {
      return (
        <Flow<CreateProxyProps>
          {...props}
          name="proxy"
          steps={[Explanation(), Creation(), Done]}
          captureStateChange={(observable$) => observable$.subscribe()}
          // updateState={(newState) => {
          //   if (newState.proxyAddress) {
          //     updateState$.next({ proxyAddress: newState.proxyAddress })
          //   }
          // }}
        />
      )
    },
    canSkip: (props: CreateProxyProps) => {
      return !!props.proxyAddress
    },
  }
}
