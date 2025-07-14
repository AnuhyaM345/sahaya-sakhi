interface ProgressProps {
    value: number
    className?: string
  }
  
  export function Progress({ value, className = '' }: ProgressProps) {
    return (
      <div className={`w-full bg-white rounded-full h-4 ${className}`}>
        <div
          className="bg-blue-600 h-4 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    )
  }
  