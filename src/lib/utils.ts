import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomChoice = <T extends any[]>(choices: T): T[number] =>
  choices[Math.floor(Math.random() * choices.length)];
