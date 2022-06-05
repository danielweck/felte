import { errorStores, warningStores } from './stores';
import { createId } from '@felte/common';

function reporterSvelte(currentForm) {
  const config = currentForm.config;
  if (currentForm.stage === 'SETUP') {
    if (!config.__felteReporterSvelteId) {
      const id = createId(21);
      config.__felteReporterSvelteId = id;
      errorStores[id] = currentForm.errors;
      warningStores[id] = currentForm.warnings;
    }
    return {};
  }
  if (!currentForm.form.hasAttribute('data-felte-reporter-svelte-id')) {
    currentForm.form.dataset.felteReporterSvelteId =
      config.__felteReporterSvelteId;
  }
  return {
    onSubmitError() {
      const firstInvalidElement =
        currentForm &&
        currentForm.form.querySelector(
          '[aria-invalid="true"]:not([type="hidden"])'
        );
      firstInvalidElement && firstInvalidElement.focus();
    },
  };
}

export function reporter(currentFormOrOptions) {
  if (!currentFormOrOptions || 'preventFocusOnError' in currentFormOrOptions) {
    return (currentForm) => reporterSvelte(currentForm, currentFormOrOptions);
  }
  return reporterSvelte(currentFormOrOptions);
}
