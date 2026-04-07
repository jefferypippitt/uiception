/** Typing speed for the simulated user input */
export const TYPE_CHAR_MS = 55

/** Pause after the user finishes typing before "sending" */
export const PRE_SEND_DELAY_MS = 420

/** How long the "sending" flash lasts */
export const SEND_FLASH_MS = 280

/** How long the bot "thinks" before responding */
export const BOT_THINK_MS = 2200

/** Typing speed for the bot response */
export const BOT_TYPE_CHAR_MS = 30

/** How long the completed conversation sits before looping */
export const LOOP_PAUSE_MS = 3600

export const EXCHANGE = {
  question: "Why was my transfer flagged?",
  answer: "Your $4,200 transfer to a new payee triggered a routine compliance check. It's been reviewed and cleared — funds will arrive by end of day. No action needed on your end.",
}

export const SUGGESTIONS = [
  "Set this payee as trusted",
  "View my transfer history",
] as const
