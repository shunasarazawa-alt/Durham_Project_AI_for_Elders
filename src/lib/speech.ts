type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function speechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null
}

export function createSpeechRecognition(handlers: {
  onResult: (transcript: string, isFinal: boolean) => void
  onError: (message: string) => void
  onEnd: () => void
}): { start: () => void; stop: () => void } | null {
  const Ctor = getRecognitionCtor()
  if (!Ctor) return null

  const recognition = new Ctor()
  recognition.lang = 'en-GB'
  recognition.continuous = true
  recognition.interimResults = true

  recognition.onresult = (event) => {
    let interim = ''
    let finalText = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript
      if (event.results[i].isFinal) finalText += piece
      else interim += piece
    }
    if (finalText) handlers.onResult(finalText, true)
    else if (interim) handlers.onResult(interim, false)
  }

  recognition.onerror = (event) => {
    if (event.error === 'aborted' || event.error === 'no-speech') return
    handlers.onError(
      event.error === 'not-allowed'
        ? 'Microphone permission is needed. Please allow the mic in your browser settings.'
        : `Could not hear you (${event.error}). Please try again.`,
    )
  }

  recognition.onend = () => handlers.onEnd()

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  }
}

export function speakText(text: string): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) return null
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-GB'
  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
  return utterance
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
