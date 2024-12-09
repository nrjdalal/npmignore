import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function humanNumbers(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function humanTime(time: string | number | Date | null | undefined) {
  if (!time) return new Date().toLocaleString()
  const date = new Date(time)
  return formatDistanceToNow(date, { addSuffix: true })
}
