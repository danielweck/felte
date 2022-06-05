export { FelteSubmitError } from '@felte/core';
export type {
  FelteSubmitEvent,
  FelteErrorEvent,
  FelteSuccessEvent,
} from '@felte/core';
import type { Readable } from 'svelte/store';
import type {
  Obj,
  FormConfig,
  Keyed,
  Errors,
  Touched,
  Helpers,
  Form,
  Paths,
  FieldsSetter,
  ObjectSetter,
  FelteSubmitEvent,
  FelteErrorEvent,
  FelteSuccessEvent,
} from '@felte/core';
import { createForm, isEqual, createEventConstructors } from '@felte/core';
import { writable } from './stores';

type StoreValues<Data extends Obj> = {
  [key: string]: unknown;

  data?: Keyed<Data>;

  errors?: Errors<Data>;

  touched?: Touched<Data>;

  warnings?: Errors<Data>;

  isSubmitting: boolean;

  isDirty: boolean;

  isValid?: boolean;

  isValidating: boolean;

  interacted: string | null;
};

function failFor(name: string) {
  return function () {
    throw new TypeError(
      `Can't call "${name}" on HTMLFelteFormElement. The element is not ready yet.`
    );
  };
}

const storeKeys = [
  'data',
  'errors',
  'touched',
  'warnings',
  'isSubmitting',
  'isDirty',
  'isValid',
  'isValidating',
  'interacted',
];

function capitalizeFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export class FelteForm<Data extends Obj = any> extends HTMLElement {
  [key: string]: unknown;

  id!: string;

  private _configuration: FormConfig<Data> = {};
  set configuration(config: FormConfig<Data>) {
    this._configuration = config;
    if (this._destroy) {
      this._destroy();
      this._destroy = undefined;
      this._ready = false;
      this._createForm();
    }
  }

  get configuration() {
    return this._configuration;
  }

  elements?: HTMLFormElement['elements'];

  /* Stores (observables) */
  private _storeValues: StoreValues<Data> = {
    data: undefined,
    errors: undefined,
    touched: undefined,
    warnings: undefined,
    isSubmitting: false,
    isDirty: false,
    isValid: undefined,
    isValidating: false,
    interacted: null,
  };

  get data() {
    return this._storeValues.data;
  }

  onDataChange?(data: Data): void;

  setData: ObjectSetter<Data, Paths<Data>> = failFor('setData');

  setFields: FieldsSetter<Data, Paths<Data>> = failFor('setFields');

  setInitialValues: Helpers<Data, Paths<Data>>['setInitialValues'] = failFor(
    'setInitialValues'
  );

  addField: Helpers<Data, Paths<Data>>['addField'] = failFor('addField');

  unsetField: Helpers<Data, Paths<Data>>['unsetField'] = failFor('unsetField');

  swapFields: Helpers<Data, Paths<Data>>['swapFields'] = failFor('swapFields');

  moveField: Helpers<Data, Paths<Data>>['moveField'] = failFor('moveField');

  resetField: Helpers<Data, Paths<Data>>['resetField'] = failFor('resetField');

  reset: Helpers<Data, Paths<Data>>['reset'] = failFor('reset');

  submit: () => void = failFor('submit');

  createSubmitHandler: Form<Data>['createSubmitHandler'] = failFor(
    'createSubmitHandler'
  );

  get errors() {
    return this._storeValues.errors;
  }

  onErrorsChange?(errors: Errors<Data>): void;

  setErrors: Helpers<Data, Paths<Data>>['setErrors'] = failFor('setErrors');

  get touched() {
    return this._storeValues.touched;
  }

  onTouchedChange?(touched: Touched<Data>): void;

  setTouched: Helpers<Data, Paths<Data>>['setTouched'] = failFor('setTouched');

  get warnings() {
    return this._storeValues.warnings;
  }

  onWarningsChange?(warnings: Errors<Data>): void;

  setWarnings: Helpers<Data, Paths<Data>>['setWarnings'] = failFor(
    'setWarnings'
  );

  get isSubmitting() {
    return this._storeValues.isSubmitting;
  }

  onIsSubmittingChange?(isSubmitting: boolean): void;

  setIsSubmitting: Helpers<Data, Paths<Data>>['setIsSubmitting'] = failFor(
    'setIsSubmitting'
  );

  get isDirty() {
    return this._storeValues.isDirty;
  }

  onIsDirtyChange?(isDirty: boolean): void;

  setIsDirty: Helpers<Data, Paths<Data>>['setIsDirty'] = failFor('setIsDirty');

  get isValid() {
    return this._storeValues.isValid;
  }

  onIsValidChange?(isValid: boolean): void;

  get isValidating() {
    return this._storeValues.isValidating;
  }

  onIsValidatingChange?(isValidating: boolean): void;

  get interacted() {
    return this._storeValues.interacted;
  }

  onInteractedChange?(interacted: string | null): void;

  setInteracted: Helpers<Data, Paths<Data>>['setInteracted'] = failFor(
    'setInteracted'
  );

  private _ready = false;
  get ready() {
    return this._ready;
  }

  onFelteReady?(): void;

  validate: Helpers<Data, Paths<Data>>['validate'] = failFor('validate');

  private _formElement: HTMLFormElement | null = null;

  private _destroy?: () => void;

  private _createForm() {
    const formElement = this._formElement;
    if (!formElement) return;
    const config = this.configuration;
    this.elements = formElement.elements;

    const { form, cleanup, ...rest } = createForm<Data>(config, {
      storeFactory: writable,
    });
    this.setData = rest.setData;
    this.setFields = rest.setFields;
    this.setErrors = rest.setErrors;
    this.setTouched = rest.setTouched;
    this.setWarnings = rest.setWarnings;
    this.setIsSubmitting = rest.setIsSubmitting;
    this.setIsDirty = rest.setIsDirty;
    this.setInteracted = rest.setInteracted;
    this.setInitialValues = rest.setInitialValues;
    this.validate = rest.validate;
    this.addField = rest.addField;
    this.unsetField = rest.unsetField;
    this.swapFields = rest.swapFields;
    this.moveField = rest.moveField;
    this.resetField = rest.resetField;
    this.reset = rest.reset;
    this.submit = rest.handleSubmit;
    this.createSubmitHandler = rest.createSubmitHandler;

    const unsubs = storeKeys.map((key) => {
      return (rest[key as keyof typeof rest] as Readable<any>).subscribe(
        ($value) => {
          if (isEqual($value, this._storeValues[key as string])) return;
          this._storeValues[key as string] = $value;
          const handler = this[`on${capitalizeFirst(key)}Change`];
          if (typeof handler === 'function') handler($value);
          this.dispatchEvent(new Event(`${key.toLowerCase()}change`));
        }
      );
    });
    const { destroy } = form(formElement);

    const {
      createSubmitEvent,
      createErrorEvent,
      createSuccessEvent,
    } = createEventConstructors<Data>();

    const handleFelteSubmit = (e: Event) => {
      const event = e as FelteSubmitEvent;
      const submitEvent = createSubmitEvent();
      this.dispatchEvent(submitEvent);
      if (submitEvent.defaultPrevented) event.preventDefault();
      event.onSubmit = submitEvent.onSubmit;
      event.onSuccess = submitEvent.onSuccess;
      event.onError = submitEvent.onError;
    };

    const handleFelteSuccess = (e: Event) => {
      const event = e as FelteSuccessEvent;
      const successEvent = createSuccessEvent(event.detail);
      this.dispatchEvent(successEvent);
    };

    const handleFelteError = (e: Event) => {
      const event = e as FelteErrorEvent;
      const errorEvent = createErrorEvent(event.detail);
      this.dispatchEvent(errorEvent);
      event.errors = errorEvent.errors;
      if (errorEvent.defaultPrevented) event.preventDefault();
    };

    formElement.addEventListener('feltesubmit', handleFelteSubmit);
    formElement.addEventListener('feltesuccess', handleFelteSuccess);
    formElement.addEventListener('felteerror', handleFelteError);
    this._destroy = () => {
      destroy();
      cleanup();
      formElement.removeEventListener('feltesubmit', handleFelteSubmit);
      formElement.removeEventListener('feltesuccess', handleFelteSuccess);
      formElement.removeEventListener('felteerror', handleFelteError);
      unsubs.forEach((unsub) => unsub());
    };
    this._ready = true;
    this.onFelteReady?.();
    this.dispatchEvent(
      new Event('felteready', { bubbles: true, composed: true })
    );
  }

  private _updateForm = () => {
    const formElement = this.querySelector('form') as HTMLFormElement | null;
    if (!formElement || formElement === this._formElement) return;
    this.dispatchEvent(
      new Event('felteconnect', { bubbles: true, composed: true })
    );
    this._formElement = formElement;
    this._destroy?.();
    this._destroy = undefined;
    this._createForm();
  };

  private _observer?: MutationObserver;

  connectedCallback() {
    setTimeout(() => {
      this._updateForm();
      this._observer = new MutationObserver(this._updateForm);
      this._observer.observe(this, { childList: true });
    });
  }

  disconnectedCallback() {
    this._destroy?.();
    this._observer?.disconnect();
  }

  static get observedAttributes() {
    return ['id'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (oldValue === newValue) return;
    switch (name) {
      case 'id':
        this.id = newValue;
        break;
    }
  }
}
