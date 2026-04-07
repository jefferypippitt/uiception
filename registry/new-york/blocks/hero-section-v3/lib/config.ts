/** Typing speed for the simulated user input */
export const TYPE_CHAR_MS = 25

/** Pause after the user finishes typing before "sending" */
export const PRE_SEND_DELAY_MS = 200

/** How long the "sending" flash lasts */
export const SEND_FLASH_MS = 150

/** How long the bot "thinks" before responding */
export const BOT_THINK_MS = 1200

/** Typing speed for the bot response */
export const BOT_TYPE_CHAR_MS = 12

/** How long the completed conversation sits before looping */
export const LOOP_PAUSE_MS = 3600

export const EXCHANGE = {
  question: "Do you have a table for 2 this Saturday at 8pm?",
  answer:
    "Yes, we have availability this Saturday at 8:00 pm for 2 guests. Shall I reserve it under your name? Also let me know if you have any dietary requirements or a special occasion we should know about.",
}

export const SUGGESTIONS = [
  "Yes, reserve it under my name",
  "Do you have low-sugar options for diabetic guests?",
] as const
