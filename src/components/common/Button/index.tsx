import styles from "./style.module.css";
import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'default' | 'outline' | 'ghost'
}

const variants = {
  default: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm',
  outline: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100',
}

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  return <button
    data-slot="button"
    className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${styles.button} ${className}`}
    {...props}
  />
}
