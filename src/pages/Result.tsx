import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { generateHelp } from '../lib/ai'
import { safetyMessage } from '../lib/prompt'
import { getTaskById } from '../lib/registry'
import { speakText, stopSpeaking } from '../lib/speech'
import { getSession, saveResult, setSession, type SessionPayload } from '../lib/storage'
import type { TaskDefinition } from '../types/task'

export function Result() {
  const navigate = useNavigate()
  const rawSession = getSession()
  const rawTask = rawSession ? getTaskById(rawSession.taskId) : undefined

  if (!rawSession || !rawTask) {
    return (
      <Layout>
        <h1 className="page-title">Nothing here yet</h1>
        <p className="page-lead">Choose a task from home first.</p>
        <Link to="/" className="btn btn-primary btn-block">
          Go home
        </Link>
      </Layout>
    )
  }

  return <ResultView session={rawSession} task={rawTask} navigate={navigate} />
}

function ResultView({
  session,
  task,
  navigate,
}: {
  session: SessionPayload
  task: TaskDefinition
  navigate: ReturnType<typeof useNavigate>
}) {
  const [speaking, setSpeaking] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [result, setResult] = useState(session.result)
  const [busy, setBusy] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const warning = safetyMessage(task.safety)

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  async function onRegenerate() {
    setBusy(true)
    stopSpeaking()
    setSpeaking(false)
    try {
      const { text, usedDemo: demo } = await generateHelp(task, session.answers)
      setResult(text)
      setSession({ ...session, result: text, usedDemo: demo })
      setNote(null)
    } finally {
      setBusy(false)
    }
  }

  function onReadAloud() {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    const u = speakText(result)
    if (!u) return
    setSpeaking(true)
    u.onend = () => setSpeaking(false)
  }

  async function onShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: task.title, text: result })
        return
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(result)
    setNote('Copied. You can paste it into a message.')
  }

  function onSave() {
    saveResult({
      taskId: task.id,
      taskTitle: task.title,
      result,
      answers: session.answers,
    })
    setNote('Saved.')
  }

  return (
    <Layout>
      <h1 className="page-title">Your help</h1>
      {warning && <div className="warn-banner">{warning}</div>}

      <article className="result-card" aria-live="polite">
        {busy ? 'Please wait…' : result}
      </article>

      {note && <p className="status-line">{note}</p>}

      <div className="result-main-actions">
        <button type="button" className="btn btn-dark btn-block" onClick={onReadAloud} disabled={busy}>
          {speaking ? 'Stop reading' : 'Read aloud'}
        </button>
        <Link to="/" className="btn btn-primary btn-block">
          Finished
        </Link>
      </div>

      {!showMore ? (
        <button type="button" className="text-link-btn" onClick={() => setShowMore(true)}>
          More options
        </button>
      ) : (
        <div className="result-more">
          <button type="button" className="btn btn-secondary btn-block" onClick={onSave} disabled={busy}>
            Save this
          </button>
          <button type="button" className="btn btn-secondary btn-block" onClick={onShare} disabled={busy}>
            Share or copy
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={onRegenerate}
            disabled={busy}
          >
            Try again
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={() => navigate(`/task/${task.id}`)}
            disabled={busy}
          >
            Change my answers
          </button>
        </div>
      )}
    </Layout>
  )
}
