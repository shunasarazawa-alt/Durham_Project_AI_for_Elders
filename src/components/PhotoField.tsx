type Props = {
  value: string
  onChange: (dataUrl: string) => void
}

export function PhotoField({ value, onChange }: Props) {
  return (
    <div className="photo-box">
      <label className="btn btn-secondary btn-block photo-label">
        Take or choose a photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          aria-label="Take or choose a photo"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => {
              if (typeof reader.result === 'string') onChange(reader.result)
            }
            reader.readAsDataURL(file)
          }}
        />
      </label>
      {value && <img className="photo-preview" src={value} alt="Your photo" />}
      {value ? (
        <button type="button" className="text-link-btn" onClick={() => onChange('')}>
          Remove photo
        </button>
      ) : (
        <p className="page-lead">You can skip this and type or speak the words next.</p>
      )}
    </div>
  )
}
