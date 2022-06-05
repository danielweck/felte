let prefersDarkScheme = false;
let matchesPrefersDarkScheme: boolean;
let observer: MutationObserver;
let mqList: MediaQueryList;

export class ThemeToggle extends HTMLElement {
  button!: HTMLButtonElement;

  constructor() {
    super();
    this.mutationCallback = this.mutationCallback.bind(this);
    this.watchMedia = this.watchMedia.bind(this);
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
  }

  updatePressed() {
    this.button.setAttribute('aria-pressed', String(prefersDarkScheme));
  }

  mutationCallback(mutationsList: MutationRecord[]) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'class')
        continue;
      prefersDarkScheme = (mutation.target as HTMLElement).classList.contains(
        'dark'
      );
    }
    this.updatePressed();
  }

  setLightMode() {
    prefersDarkScheme = false;
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    if (matchesPrefersDarkScheme) localStorage.setItem('colorScheme', 'light');
    else localStorage.removeItem('colorScheme');
  }

  setDarkMode() {
    prefersDarkScheme = true;
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    if (!matchesPrefersDarkScheme) localStorage.setItem('colorScheme', 'dark');
    else localStorage.removeItem('colorScheme');
  }

  watchMedia(e) {
    if (!e.matches) this.setLightMode();
    else this.setDarkMode();
    this.updatePressed();
  }

  toggleDarkMode() {
    if (prefersDarkScheme) this.setLightMode();
    else this.setDarkMode();
    this.updatePressed();
  }

  connectedCallback() {
    observer = new MutationObserver(this.mutationCallback);
    observer.observe(document.body, { attributes: true });
    const colorScheme = localStorage.getItem('colorScheme');
    mqList = matchMedia('(prefers-color-scheme: dark)');
    matchesPrefersDarkScheme = mqList.matches;
    mqList.addEventListener('change', this.watchMedia);
    if (colorScheme) prefersDarkScheme = colorScheme === 'dark';
    else prefersDarkScheme = matchesPrefersDarkScheme;
    if (prefersDarkScheme) document.body.classList.add('dark');
    else document.body.classList.add('light');
    this.button = this.querySelector('button');
    this.button.addEventListener('click', this.toggleDarkMode);
    this.updatePressed();
  }

  disconnectedCallback() {
    observer?.disconnect();
    mqList?.removeEventListener('change', this.watchMedia);
    this.button?.removeEventListener('click', this.toggleDarkMode);
  }
}

customElements.define('theme-toggle', ThemeToggle);
