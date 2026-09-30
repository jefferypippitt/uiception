/**
 * One grid for the plan cards and every comparison row: one column per plan.
 * Sharing it is what keeps each value centered under its card.
 */
export const planGridClassName = "grid grid-cols-3 gap-x-2 sm:gap-x-4"

/**
 * From md the feature label floats inside the first plan column, capped at the
 * space left of that column's centered value: (row − 2 gaps) / 6 is half a
 * column, minus 1rem so it never touches the value.
 */
export const featureLabelClassName =
  "md:absolute md:inset-y-0 md:left-0 md:flex md:w-[calc((100%-2rem)/6-1rem)] md:items-center"
