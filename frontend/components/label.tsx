import { LabelHTMLAttributes } from 'react'

export function Label({ children, className = '', ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-gray-800 ${className}`} {...props}>
      {children}
    </label>
  )
}
