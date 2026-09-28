import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind CSS classnames merge. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
