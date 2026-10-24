import type { TaskField } from '../types/task'

type Props = {
  field: TaskField
  value: string | string[]
  onChange: (value: string | string[]) => void
}

export function ChoiceField({ field, value, onChange }: Props) {
  const options = field.options ?? []

  if (field.type === 'multiChoice') {
    const selected = Array.isArray(value) ? value : []
    return (
      <div className="choice-list" role="group" aria-label={field.label}>
        {options.map((opt) => {
          const isOn = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              className={`choice${isOn ? ' selected' : ''}`}
              aria-pressed={isOn}
              onClick={() => {
                onChange(
                  isOn ? selected.filter((v) => v !== opt.value) : [...selected, opt.value],
                )
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  const current = typeof value === 'string' ? value : ''
  return (
    <div className="choice-list" role="radiogroup" aria-label={field.label}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`choice${current === opt.value ? ' selected' : ''}`}
          role="radio"
          aria-checked={current === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
