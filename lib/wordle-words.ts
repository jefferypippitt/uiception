/**
 * Word lists are vendored from the MIT-licensed `wordle-words` package
 * (https://github.com/chantastic/wordle-words) as `wordle-words-data.mjs`.
 */
import { answers, all } from "./wordle-words-data.mjs"

/** Words that may be chosen as the solution */
export const WORDLE_SOLUTIONS: readonly string[] = answers

/** All 5-letter strings accepted as a guess */
export const ALLOWED_GUESSES: ReadonlySet<string> = new Set(all)
