Overview
---

- `Flow` component manages current displayed step, back/forward and skip.
  - It renders the current step, and can be displayed like a standard react component.
  - Handles what happens when a step calls `back`, or `next`.
  - Checks to see if steps are skippable.
  - Steps are hidden using CSS, with the current step being shown:
    - Allows the step to contibute to the form state without being displayed (ie. proxy actions)
    - Allows steps to maintain their state without storing this on the complete state of the form.
    - Allows transitions to be further animated using CSS.
- `Step<T>`s are objects that contain a `Component` prop, which is a react component.
  - `T` is the props relevant to the step (both what they consume and what they update).
  - Steps control when they move on, not `Flow`.
  - A step can also be an `ISkippableStep<T>` in which case it also implements a `skip` method `(T -> boolean)`
  - If a step is complete (i.e. proxy/allowance), it can call `props.skip!()` inside `useEffect` to cause `Flow` to skip the step and go the next one.
  - They can handle their own IO, validation and side effects
  - They can call `props.updateState(s: T)` to update the global state.
  - Steps can also render `Flow` - i.e. wizards can be nested.
  - Steps can call `props.updateState` inside useEffect to provide state without being rendered.
- Data state (not state deciding which step to display) is the intersection of all props handled by the handled by the parent component of `Flow`.
  - i.e `type OpenBorrowVaultType = SimulateStepProps & CreateProxyProps & ConfirmationProps & CompleteProps`
- `OpenBorrowVault` is an example of a specific user flow.
  - It consumes steps
  - It also consumes flows `CreateProxy` and `Allowance`, which are themselves steps and also use `Flow`
- Pipes can be consumed either at the top level or in the steps:
  - Can be step-specific if necessary (for example CreateProxy step creating the proxy and reading the address)
  - Can be for the entire flow, if there is data required by multiple steps.

Advantages
---

- Composable flows reduce duplication and coupling between different user journies.
- Isolated steps make smaller, more focused pipes.
- Easy to read steps order.
- Steps order is not in pipes - smaller pipes.

Improvements
---

- Typesafety between steps inside `Flow`.  Intersection type causes lots of nullables which need to be handled by code, and steps can be reordered without compiled time errors.  Is there some typescript solution to this?
- State handled generically inside `Flow` rather than parent?  Unsure if this is right thing to do as state needs to update all the time from outside `Flow`.
- jump/link to specific step

Unanswered questions
---
- Do we need a central validation on the state?  Could just build validation from props and compose some common rules if necessary. Can use decorators?

Unsupported things
---
- branching - `Flow` is only linear