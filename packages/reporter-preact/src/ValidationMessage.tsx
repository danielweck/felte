import type { VNode, ComponentType } from 'preact';
// eslint-disable-next-line
import { h, Fragment } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { _get, getPath, createId } from '@felte/common';
import { errorStores, warningStores } from './stores';

export type ValidationMessageProps = {
  [key: string]: any;
  for: string;
  level?: 'error' | 'warning';
  children: (
    messages: string[] | null
  ) =>
    | VNode<any>
    | undefined
    | null
    | Element
    | Element[]
    | VNode<any>[]
    | false;
  as?: string | ComponentType<any>;
};

export function ValidationMessage(props: ValidationMessageProps) {
  const { level: _level, for: path, children, as, id: _id, ...rest } = props;
  const level = props.level ?? 'error';
  const [messages, setMessages] = useState<string[] | null>(null);
  const id = useMemo(() => props.id ?? createId(21), []);
  function getFormElement(element: HTMLDivElement) {
    return element.closest('form');
  }

  useEffect(() => {
    let unsubscriber;
    // To guarantee the DOM has rendered we need to setTimeout
    setTimeout(() => {
      const element = document.getElementById(id) as HTMLDivElement;
      const errorPath = getPath(element, path);
      const formElement = getFormElement(element) as HTMLFormElement;
      const reporterId = formElement?.dataset.felteReporterPreactId;
      if (!reporterId) return;
      if (level === 'error') {
        const errors = errorStores[reporterId];
        unsubscriber = errors.subscribe(($errors) => {
          setMessages(_get($errors, errorPath) as any);
        });
      } else {
        const warnings = warningStores[reporterId];
        unsubscriber = warnings.subscribe(($warnings) => {
          setMessages(_get($warnings, errorPath) as any);
        });
      }
    });
    return unsubscriber;
  }, []);

  if (!as) {
    return (
      <>
        <div id={id} style={{ display: 'none' }} />
        {children(messages)}
      </>
    );
  }
  return h(as as any, { ...rest, id }, children(messages));
}
