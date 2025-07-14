import { ReactNode, isValidElement, cloneElement } from 'react'

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
}

interface RadioGroupItemProps {
  value: string
  id: string
  checked?: boolean
  onChange?: (value: string) => void
}

export function RadioGroup({ value, onValueChange, children }: RadioGroupProps) {
  const enhancedChildren = Array.isArray(children)
    ? children.map((child) => {
        if (isValidElement<RadioGroupItemProps>(child)) {
          return cloneElement(child, {
            checked: child.props.value === value,
            onChange: onValueChange,
          })
        }
        return child
      })
    : isValidElement<RadioGroupItemProps>(children)
    ? cloneElement(children, {
        checked: children.props.value === value,
        onChange: onValueChange,
      })
    : children

  return <div className="space-y-2">{enhancedChildren}</div>
}

export function RadioGroupItem({ value, id, checked = false, onChange }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      id={id}
      name="radio-group"
      value={value}
      checked={checked}
      onChange={() => onChange?.(value)}
      className="accent-blue-600 cursor-pointer"
    />
  )
}
