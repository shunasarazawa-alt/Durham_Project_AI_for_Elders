import { useEffect, useRef, useState } from 'react'
import { createSpeechRecognition, speechRecognitionSupported } from '../lib/speech'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function VoiceTextField({ value, onChange, placeholder, rows = 5 }: Props) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [interim, setInterim] = useState('')
  const baseRef = useRef(value)
  const supported = speechRecognitionSupported()
  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition>>(null)

  useEffect(() => {
    baseRef.current = value
  }, [value])

  function toggleListen() {
    setError(null)
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      setInterim('')
      return
    }

    const recognition = createSpeechRecognition({
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          const next =
            `${baseRef.current}${baseRef.current && !baseRef.current.endsWith(' ') ? ' ' : ''}${transcript}`.trimStart()
          baseRef.current = next
          onChange(next)
          setInterim('')
        } else {
          setInterim(transcript)
        }
      },
      onError: (message) => {
        setError(message)
        setListening(false)
        setInterim('')
      },
      onEnd: () => {
        setListening(false)
        setInterim('')
      },
    })

    if (!recognition) {
      setError('Voice is not available here. Please type instead.')
      return
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setListening(true)
    } catch {
      setError('Could not start the microphone. Please try again.')
    }
  }

  const displayValue = interim ? `${value}${value ? ' ' : ''}${interim}` : value

  return (
    <div className="voice-field">
      <button
        type="button"
        className={`btn btn-mic btn-block${listening ? ' listening' : ''}`}
        onClick={toggleListen}
        disabled={!supported && !listening}
      >
        {listening ? 'Stop' : 'Press to speak'}
      </button>

      {listening && <p className="status-line">Listening…</p>}

      <label className="field-label" htmlFor="voice-text">
        Or type here
      </label>
      <textarea
        id="voice-text"
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />

      {value && (
        <button type="button" className="text-link-btn" onClick={() => onChange('')}>
          Clear words
        </button>
      )}

      {!supported && <p className="status-line">You can type if speaking is not available.</p>}
      {error && <p className="error-line">{error}</p>}
    </div>
  )
}
