---
section: Stores
subsections:
  - data
  - errors
  - warnings
  - touched
  - isValid
  - isSubmitting
  - isDirty
  - isValidating
  - interacted
---

## Stores

Felte keeps stores internally to keep track of all of your data, these can be read by using accessors returned by `useForm`. These accessors are functions that when called return the current value of the store and trigger re-renders of your component whenever the value of the store changes. These accessors also accept a function as a first argument which can be used to obtain derived values from the stores, or to obtain a specific property of the store (in the case of stores that contain objects). The latter can also receive a string path to a property as well.

If you use the accessor to get only a specific property of a store, then Felte will _only_ trigger re-renders when that specific property has changed.

### data

An accessor that contains the form's values. Depending on the field type, the values can be either a `string`, an array of `string`s, a `number`, a `boolean`, a `File`, an array of `File`s or `undefined` if no value has been set.

As described above, we can obtain the value of the whole store by calling `data()`, or a specific field by passing a string path or selector function. E.g. if the store had an `email` property, we could access it either like `data('email')` or `data(($data) => $data.email)`.

> **NOTE**: TypeScript users, if using the string path version, must always use dot notation even if referring to arrays. E.g. `user.friends.0.name`.

The following example showcases using the selector to obtain a derived value:

```jsx
import { useForm } from '@felte/react';

function Form() {
  const { form, data } = useForm({ onSubmit: values => console.log(values) });

  return (
    <form ref={form}>
      <input name="email" />
      <input name="password" type="password" />
      {/* The component will only re-render when the length of the password changes */}
      <span>Your password is {data(($data) => $data.password.length)} characters long</span>
      <button>Submit</button>
    </form>
  );
}
```

### errors

An accessor that contains the validation errors in the form. It will have the same shape as `data` but containing either `null` if there's no errors, or an array of strings if there are.

### warnings

An accessor that contains warnings on the form fields set by the `warn` function. Unlike the `errors` store, this store will have validation messages immediately and not only when a field is touched. Its behaviour is the same as `data`.

### touched

An accessor with the same shape as `data` but containing `boolean`s as values, defining if the field has been touched or not. Its behaviour is the same as `data`.

### isValid

An accesor containing a single boolean that tells if the form is valid or not. This accessor can not be called with a string path.

### isSubmitting

An accessor containing a single boolean that tells if the form is submitting or not. This accessor can not be called with a string path.

### isDirty

An accessor containing a single boolean that tells if the form is dirty or not. This accessor can not be called with a string path.

### isValidating

An accessor containing a single boolean that tells if the form is currently validating. Useful to know if an async or debounced validation is running.

### interacted

An accessor containing either `null` or the name of the field the user last interacted with as a `string`. Note that this only updates on user events triggered from native fields or fields created using `useField`. Its value gets reset to `null` on form submission, calls to `validate` and calls to `reset`.
