import { Flow, GenericStepProps } from './Flow'
import { useEffect, useState } from 'react'

type OpenVaultType = SimulateStepProps & CreateProxyProps

type SimulateStepProps = {
  ethPrice: number
  depositAmount?: number
  depositAmountUsd?: number
}

function SimulateStep(props: GenericStepProps<SimulateStepProps>) {
  return (
    <>
      Simulate vault
      <br />
      Eth price: {props.ethPrice}
      <br />
      Deposit amount:{' '}
      <input
        onChange={(event) =>
          props.updateState({
            ...props,
            depositAmount: event.target.value ? parseFloat(event.target.value) : undefined,
          })
        }
      />
      {props.depositAmountUsd && (
        <>
          <br />({props.depositAmountUsd} USD)
        </>
      )}
      <br />
      <button disabled={!props.previous} onClick={props.previous}>
        previous
      </button>
      <button disabled={!props.next} onClick={props.next}>
        next
      </button>
    </>
  )
}

type CreateProxyProps = {
  walletAddress: string
  depositAmountUsd?: number
}

function CreateProxy(props: GenericStepProps<CreateProxyProps>) {
  return (
    <>
      Create proxy
      <br />
      {props.depositAmountUsd && (
        <>
          <br />({props.depositAmountUsd} USD)
        </>
      )}
      <button disabled={!props.previous} onClick={props.previous}>
        previous
      </button>
      <button disabled={!props.next} onClick={props.next}>
        next
      </button>
    </>
  )
}

function calculateViewModal(state: OpenVaultType): OpenVaultType {
  return {
    ...state,
    depositAmountUsd: state.depositAmount && state.depositAmount * state.ethPrice,
  }
}

export function OpenVault() {
  const [viewState, setViewState] = useState<OpenVaultType>({
    ethPrice: 2000,
    walletAddress: 'wallet address',
  })

  useEffect(() => {
    const i = setInterval(() => {
      setViewState((oldState) => {
        return calculateViewModal({ ...oldState, ethPrice: Math.random() * 10000 })
      })
    }, 1000)
    return () => clearInterval(i)
  })

  return (
    <Flow<OpenVaultType>
      steps={[SimulateStep, CreateProxy]}
      {...viewState}
      updateState={(newState) =>
        setViewState((oldState) => calculateViewModal({ ...oldState, ...newState }))
      }
    />
  )
}
