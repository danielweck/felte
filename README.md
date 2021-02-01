# Felte: A form library for Svelte

Felte is a simple to use form library for Svelte. It is based on Svelte stores nd Selte actions for its functionality. No `Field` or `Form` components, just plain stores and actions to build your form however you like.


## Why

I felt that Svelte would allow to create a simple, almost configuration-less way to handle forms. Current libraries (at least that I have found) still make forms feel reliant on a lot of configuration, or custom Field and Form components which make it a little bit harder to customize styles. I wanted a library that would feel as simple as possible to make a form reactive, without relying on custom components, to make styling and handling forms as simple as possible. TypeScript is also a big plus.

In order to accomplish usage as simple as possible, Felte takes advantage of Svelte actions to be able to make a form reactive using only the `use` directive. Felte also has built-in error reporting capabilities by using the browser's Constraint Validation API. This means you can use the `:valid` and `:invalid` pseudo-classes to style your components and do not need to worry about reporting errors as long as you return appropriate messages from the `validate` function.

## Instalation

```sh
npm install --save felte

# Or if you use yarn

yarn add felte
```

## Usage

Felte exports a single `createForm` function that accepts a config object with the following interface:

```typescript
interface FormConfig<D extends Record<string, unknown>> {
  initialValues?: D;
  validate?: (values: D) => Errors<D>;
  onSubmit: (values: D) => void;
  onError?: (errors: unknown) => void;
  useConstraintApi?: boolean;
}
```

- `initialValues` refers to the initial values of the form.
- `validate` is a custom validation function that must return an object with the same props as initialValues, but with error messages or `undefined` as values.
- `onSubmit` is the function that will be executed when the form is submited.
- `onError` is a function that will run if the submit throws an exception. It will contain the error catched. This is optional and potential exceptions might as well be handled inside the `onSubmit` function.
= `useConstraintApi` this tells **felte** to use or not use the browser's Constraint Validation API to the report errors found in the `validate` function. By default it is `true`.

When called, `createForm` will return an object with the following interface:

```typescript
type FormAction = (node: HTMLFormElement) => { destroy: () => void };

export interface Form<D extends Record<string, unknown>> {
  form: FormAction;
  data: Writable<D>;
  errors: Readable<Errors<D>>;
  touched: Writable<Touched<D>>;
  handleSubmit: (e: Event) => void;
  isValid: Readable<boolean>;
  isSubmitting: Writable<boolean>;
}
```

- `form` is a function to be used with the `use:` directive for Svelte.
- `data` is a writable store with the current values from the form.
- `errors` is a readable store with the current errors.
- `touched` is a readable store that defines if the fields have been touched. It's an object with the same keys as data, but with boolean values.
- `handleSubmit` is the event handler to be passed to `on:submit`.
- `isValid` is a readable store that only holds a boolean denoting if the form has any errors or not.
- `isSubmitting` is a writable store that only holds a boolean denoting if the form is submitting or not.

### Using the form action

The recommended way to use it is by using the `form` action from `createForm` and using it in the form element of your form.

```html
<script>
  import { createForm } from 'felte'

  const { form, data, errors } = createForm({
    validate: (values) => {
      /* validate and return errors found */
    },
    onSubmit: async (values) => {
      /* call to an api */
    },
  })

  $: console.log($data)
  $: console.log($errors)
</script>

<form use:form>
  <input type=text name=email>
  <input type=password name=password>
  <input type=submit value="Sign in">
</form>
```

That's all you need! With the example above you'll see **Felte** automatically updating the values of `data` when you type, as well as `errors` when finding an error. Note that the only required property for `createForm` is `onSubmit`.

Also note that using the `data` and `errors` store is completely optional in this method, since you already get access to the values of the form in the `onSubmit` function, and validation errors are by default reported with the browser`s Constraint Validation API.

> If using Felte this way, make sure to set the `name` attributes of your inputs since that is what Felte uses to map to the `data` store.

Using this approach `data` will be undefined until the form element loads.

## Binding to inputs

Since `data` is a writable store, you can also bind the data properties to your inputs instead of using the `form` action.

```html
<script>
  import { createForm } from 'felte'

  const { handleSubmit, data, errors } = createForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      /* validate and return errors found */
    },
    onSubmit: async (values) => {
      /* call to an api */
    },
  })

  $: console.log($data)
  $: console.log($errors)
</script>

<form on:submit="{handleSubmit}">
  <input type=text bind:value="{$data.email}">
  <input type=password bind:value="{$data.password}">
  <input type=submit value="Sign in">
</form>
```

With this approach you should see a similar behaviour to the previous way of using this. Note that the `name` attribute is optional here, but the `initialValues` property for `createForm` is required. It is a bit more verbose, so it's recommended to use the previous way of handling forms.