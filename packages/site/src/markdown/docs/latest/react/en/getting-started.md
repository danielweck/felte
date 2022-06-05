---
section: Getting started
---

## Getting started

Felte is a JavaScript library that tries to help you ease the management of forms, form validation and the reporting of validation errors. To use its basic functionalities you'll only need the base `@felte/react` package from npm.

```sh
npm i -S @felte/react
```

If you use pnpm:

```sh
pnpm add @felte/react
```

If you use yarn:

```sh
yarn add @felte/react
```

> **NOTE**: If you're using preact, you can use `@felte/preact` instead. The API is the same so you can refer to this documentation for it as well!

Then, inside of the React component where you have your form, import the `useForm` function and call it with a configuration object containing an `onSubmit` function. The `useForm` function returns a function that you can use in any form as a `ref` to the HTML form element. This is all you need to make Felte track your form.

```tsx
import { useForm } from '@felte/react';

export function Form() {
  const { form } = useForm({
    onSubmit: (values) => {
      // ...
    },
  });

  return (
    <form ref={form}>
      <input type="text" name="email" />
      <input type="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

The `onSubmit` handler is actually optional. If no handler is provided, Felte will send a request using `fetch` with the `action`, `method` and `enctype` attributes of your `form` element. It will send the request as `multipart/form-data` if you specify it with the `enctype` (which you should do if your form contains an `<input type=file>`), or `application/x-www-form-urlencoded`.

```jsx
import { useForm } from '@felte/react';

export function Form() {
  const { form } = useForm();

  return (
    <form ref={form} action="/example" method="post">
      <input type="text" name="email" />
      <input type="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

> You can read more about the different ways to submit your forms in the [submitting section](/docs/react/submitting).

Felte does not export any components like `Form`, `Field` or anything like that, but you do need to make felte aware of your inputs by assigning a **name** to them.

In its most basic form (such as the previous example), using Felte does not trigger any re-renders at all.

Felte also offers [validation handling](/docs/react/validation) and [error reporting](/docs/react/reporters) but this is all you need for the most basic, validation-less form.
