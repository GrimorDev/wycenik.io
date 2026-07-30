export type Locale = "pl" | "en";

interface WidgetStrings {
  loading: string;
  loadError: string;
  back: string;
  next: string;
  name: string;
  email: string;
  phone: string;
  leadHint: string;
  showEstimate: string;
  sending: string;
  submitError: string;
  resultLabel: string;
  resultHint: string;
  rangeFrom: string;
  rangeTo: string;
}

export const STRINGS: Record<Locale, WidgetStrings> = {
  pl: {
    loading: "Ładowanie kalkulatora…",
    loadError: "Nie udało się wczytać kalkulatora.",
    back: "Wstecz",
    next: "Dalej",
    name: "Imię",
    email: "E-mail",
    phone: "Telefon",
    leadHint: "Podaj dane kontaktowe, aby zobaczyć szacunkową wycenę.",
    showEstimate: "Pokaż wycenę",
    sending: "Wysyłanie…",
    submitError: "Nie udało się wysłać formularza. Spróbuj ponownie.",
    resultLabel: "Szacunkowa wycena",
    resultHint: "Dokładną wycenę prześlemy na podany adres e-mail.",
    rangeFrom: "Od",
    rangeTo: "do",
  },
  en: {
    loading: "Loading calculator…",
    loadError: "Failed to load the calculator.",
    back: "Back",
    next: "Next",
    name: "Name",
    email: "Email",
    phone: "Phone",
    leadHint: "Enter your contact details to see the estimate.",
    showEstimate: "Show estimate",
    sending: "Sending…",
    submitError: "Failed to submit the form. Please try again.",
    resultLabel: "Estimated price",
    resultHint: "We'll send the exact quote to your email.",
    rangeFrom: "From",
    rangeTo: "to",
  },
};
