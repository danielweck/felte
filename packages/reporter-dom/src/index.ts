import type {
  CurrentForm,
  ExtenderHandler,
  FormControl,
  Obj,
  Extender,
  Errors,
} from '@felte/common';
import { _get, getPath } from '@felte/common';

export type DomReporterOptions = {
  listType?: 'ul' | 'ol';
  listAttributes?: {
    class?: string | string[];
  };
  listItemAttributes?: {
    class?: string | string[];
  };
  single?: boolean;
  singleAttributes?: {
    class?: string | string[];
  };
  preventFocusOnError?: boolean;
};

function removeAllChildren(parent: Node): void {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function setValidationMessage<Data extends Obj>(
  reporterElement: HTMLElement,
  errors: Errors<Data>,
  {
    listType = 'ul',
    listAttributes,
    listItemAttributes,
    single,
    singleAttributes,
  }: DomReporterOptions
) {
  const elPath = getPath(
    reporterElement,
    reporterElement.dataset.felteReporterDomFor
  );
  if (!elPath) return;
  const validationMessage = _get(errors, elPath, '') as string | string[];
  removeAllChildren(reporterElement);
  if (!validationMessage) return;
  const reportAsSingle =
    (single &&
      !reporterElement.hasAttribute('data-felte-reporter-dom-as-list')) ||
    reporterElement.hasAttribute('data-felte-reporter-dom-as-single');
  const reportAsList =
    (!single &&
      !reporterElement.hasAttribute('data-felte-reporter-dom-as-single')) ||
    reporterElement.hasAttribute('data-felte-reporter-dom-as-list');
  if (reportAsSingle) {
    const spanElement = document.createElement('span');
    spanElement.setAttribute('aria-live', 'polite');
    spanElement.dataset.felteReporterDomSingleMessage = '';
    const textNode = document.createTextNode(
      Array.isArray(validationMessage)
        ? validationMessage[0] ?? ''
        : validationMessage
    );
    spanElement.appendChild(textNode);
    let classes = singleAttributes?.class;
    if (classes) {
      if (!Array.isArray(classes)) {
        classes = classes.split(' ');
      }
      spanElement.classList.add(...classes);
    }
    reporterElement.appendChild(spanElement);
  }
  if (reportAsList) {
    const messages = Array.isArray(validationMessage)
      ? validationMessage
      : [validationMessage];
    const listElement = document.createElement(listType);
    let classes = listAttributes?.class;
    if (classes) {
      if (!Array.isArray(classes)) {
        classes = classes.split(' ');
      }
      listElement.classList.add(...classes);
    }
    listElement.dataset.felteReporterDomList = '';
    for (const message of messages) {
      const messageElement = document.createElement('li');
      messageElement.dataset.felteReporterDomListMessage = '';
      const textNode = document.createTextNode(message);
      messageElement.appendChild(textNode);
      let classes = listItemAttributes?.class;
      if (classes) {
        if (!Array.isArray(classes)) {
          classes = classes.split(' ');
        }
        messageElement.classList.add(...classes);
      }
      listElement.appendChild(messageElement);
    }
    reporterElement.appendChild(listElement);
  }
}

function handleSubscription<Data extends Obj>(
  form: HTMLFormElement,
  level: 'error' | 'warning',
  options?: DomReporterOptions
) {
  return function (messages: Errors<Data>) {
    const elements: NodeListOf<HTMLElement> = form.querySelectorAll(
      '[data-felte-reporter-dom-for]'
    );
    for (const element of elements) {
      const elementLevel = element.dataset.felteReporterDomLevel || 'error';
      if (level !== elementLevel) continue;
      setValidationMessage(element, messages, options ?? {});
    }
  };
}

function domReporter<Data extends Obj = any>(
  options?: DomReporterOptions
): Extender<Data> {
  return (currentForm: CurrentForm<Data>): ExtenderHandler<Data> => {
    if (currentForm.stage === 'SETUP') return {};
    const { form } = currentForm;
    const unsubscribeErrors = currentForm.errors.subscribe(
      handleSubscription(form, 'error', options)
    );
    const unsubscribeWarnings = currentForm.warnings.subscribe(
      handleSubscription(form, 'warning', options)
    );
    return {
      destroy() {
        unsubscribeErrors();
        unsubscribeWarnings();
      },
      onSubmitError() {
        if (options?.preventFocusOnError) return;
        const firstInvalidElement = form.querySelector(
          '[data-felte-validation-message]:not([type="hidden"])'
        ) as FormControl;
        firstInvalidElement?.focus();
      },
    };
  };
}

export default domReporter;
