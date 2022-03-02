import { useState } from 'react'

function hookImplementation(_useState: typeof useState) {
  return _useState(0)
}

export function useCustomHook() {
  return hookImplementation(useState)
}
