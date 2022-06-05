# @felte/element

## 0.5.2

### Patch Changes

- Updated dependencies [ab24c7e]
  - @felte/core@1.3.2

## 0.5.1

### Patch Changes

- Updated dependencies [1386ac3]
  - @felte/core@1.3.1

## 0.5.0

### Minor Changes

- 72f5389: Pass all stores, `createSubmitHandler` and `handleSubmit` to extenders

### Patch Changes

- Updated dependencies [72f5389]
  - @felte/core@1.3.0

## 0.4.3

### Patch Changes

- 2530072: Fix module exports

## 0.4.2

### Patch Changes

- @felte/core@1.2.5

## 0.4.1

### Patch Changes

- d9e7b12: Stop bundling core/common packages to allow for code reusability
- Updated dependencies [d9e7b12]
  - @felte/core@1.2.4

## 0.4.0

### Minor Changes

- 589bb34: BREAKING: Move side effects to `@felte/element/felte-form` and `@felte/element/felte-field`

## 0.3.2

### Patch Changes

- a39ca69: Don't set default id (it was causing a default attribute of `[id=""]`)
- 34230fe: Add `target` attribute to get field from a custom selector

## 0.3.1

### Patch Changes

- 256e5b1: Handle possibility of child elements changing
- Updated dependencies [9b49b35]
  - @felte/core@1.2.3

## 0.3.0

### Minor Changes

- ddb734f: BREAKING: Update casing of event handler functions

## 0.2.6

### Patch Changes

- Updated dependencies [aa6483d]
- Updated dependencies [aa6483d]
  - @felte/core@1.2.2

## 0.2.5

### Patch Changes

- 1c88b92: Fix name of reset function of createField
- Updated dependencies [1c88b92]
  - @felte/core@1.2.1

## 0.2.4

### Patch Changes

- 4bea95a: Add `composed` attribute to `felte-field`
- fd58a47: Add support for `reset` event
- Updated dependencies [fd58a47]
  - @felte/core@1.2.0

## 0.2.3

### Patch Changes

- 456b287: Move to vanilla custom elements to reduce bundle size

## 0.2.2

### Patch Changes

- 23efb6a: Fix `prepareForm` execution

## 0.2.1

### Patch Changes

- Updated dependencies [03b9e01]
- Updated dependencies [6dafd80]
  - @felte/core@1.1.1

## 0.2.0

### Minor Changes

- c00d0e1: Add felte-field element
- c00d0e1: Add FelteSubmitEvent and allow to set errors on FelteErrorEvent

  Fixes bug where errors failed silently on submit

### Patch Changes

- c00d0e1: Allow onError to return partial errors
- Updated dependencies [c00d0e1]
- Updated dependencies [c00d0e1]
  - @felte/core@1.1.0
