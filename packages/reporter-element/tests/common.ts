import 'uvu-expect-dom/extend';
import type { CoreForm } from '@felte/core';
import { createForm as coreCreateForm } from '@felte/core';
import { writable } from 'svelte/store';
import type {
  FormConfig,
  FormConfigWithTransformFn,
  FormConfigWithoutTransformFn,
  Obj,
  UnknownStores,
  Stores,
  KnownStores,
  Helpers,
  UnknownHelpers,
  KnownHelpers,
} from '@felte/common';

export function createDOM(): void {
  const formElement = document.createElement('form');
  formElement.name = 'test-form';
  document.body.appendChild(formElement);
}

export function cleanupDOM(): void {
  removeAllChildren(document.body);
}

export type InputAttributes = {
  type?: string;
  required?: boolean;
  name?: string;
  value?: string;
  checked?: boolean;
  id?: string;
  index?: number;
};

export function createInputElement(attrs: InputAttributes): HTMLInputElement {
  const inputElement = document.createElement('input');
  if (attrs.name) inputElement.name = attrs.name;
  if (attrs.type) inputElement.type = attrs.type;
  if (attrs.value) inputElement.value = attrs.value;
  if (attrs.checked) inputElement.checked = attrs.checked;
  if (attrs.id) inputElement.id = attrs.id;
  if (typeof attrs.index !== 'undefined')
    inputElement.name = `${attrs.name}.${attrs.index}.value`;
  inputElement.required = !!attrs.required;
  return inputElement;
}

export function removeAllChildren(parent: Node): void {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function createMultipleInputElements(
  attr: InputAttributes,
  amount = 3
): HTMLInputElement[] {
  const inputs = [];
  for (let i = 0; i < amount; i++) {
    const input = createInputElement({ ...attr, index: i });
    inputs.push(input);
  }
  return inputs;
}

export function createForm<Data extends Obj>(
  config?: FormConfigWithTransformFn<Data>
): CoreForm<Data> & UnknownHelpers<Data> & UnknownStores<Data>;
export function createForm<Data extends Obj>(
  config?: FormConfigWithoutTransformFn<Data>
): CoreForm<Data> & KnownHelpers<Data> & KnownStores<Data>;
export function createForm<Data extends Obj>(
  config: FormConfig<Data> = {}
): CoreForm<Data> & Helpers<Data> & Stores<Data> {
  return coreCreateForm(config as any, {
    storeFactory: writable,
  });
}
