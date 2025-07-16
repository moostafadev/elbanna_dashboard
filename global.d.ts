/// <reference types="next" />
/// <reference types="next/types/global" />

import type {
  TranslationKey as _TranslationKey,
  LocaleKey as _LocaleKey,
  TranslationFunction as _TranslationFunction,
} from "./types/intl";

declare global {
  type TranslationKey = _TranslationKey;
  type LocaleKey = _LocaleKey;
  type TranslationFunction = _TranslationFunction;
}

export {};
