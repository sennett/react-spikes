Overview
---

- `Flow` component manages current displayed step, back/forward and skip.
  - It renders the current step, and can be displayed like a standard react component.
  - Handles what happens when a `Step` calls `back`, `next`, or `skip`.
- `Step`s are just react components that receive a `GenericStepProps<T>` props arg.
  - `T` is the props relevant to the step (both what they consume and what they update).
  - `Step`s control when they move on, not `Flow`.
  - If a step is complete (i.e. proxy/allowance), it can call `props.skip!()` inside `useEffect` to cause `Flow` to skip the step and go the next one.
  - They can handle their own IO, validation and side effects
  - They can call `props.updateState(s: T)` to update the global state.
  - `Step` can also render `Flow` - i.e. wizards can be nested.
- Data state (not display state) is the intersection of all props handled by the handled by the parent component of `Flow`.
  - i.e `type OpenBorrowVaultType = SimulateStepProps & CreateProxyProps & ConfirmationProps & CompleteProps`

Potential improvements
---

- `useEffect` to decide when step is complete causes FOUC.  Workarounds:
  - CSS to delay rendering
  - A hook/wrapper component that hides things until after useEffect has run.  Probably `skip` would be a custom hook at this point.  Could this be inside `Flow` rather than each step?
- Typesafety between `Step`s inside `Flow`.  Intersection type causes lots of nullables which need to be handled by code, and steps can be reordered without compiled time errors.  Is there some typescript solution to this?
- State handled generically inside `Flow` rather than parent?  Unsure if this is right thing to do as state needs to update all the time from outside `Flow`.
- Move from `setInterval` to pipes

Unanswered questions
---
- Do we need a central validation on the state?  Could just build validation from props and compose some common rules if necessary. Can use decorators?
- Where do the pipes go.  Are they step specific?

Unsupported things
---
- branching - `Flow` is only linear
- jump/link to specific step