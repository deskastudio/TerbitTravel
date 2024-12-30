import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using `clsx` and merges Tailwind classes using `twMerge`.
 * This ensures consistent and conflict-free class handling.
 *
 * @param inputs - An array of class names or conditions
 * @returns A single string of resolved class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
