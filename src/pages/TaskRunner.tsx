import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChoiceField } from '../components/ChoiceField'
import { Layout } from '../components/Layout'
import { PhotoField } from '../components/PhotoField'
import { VoiceTextField } from '../components/VoiceTextField'
import { generateHelp } from '../lib/ai'
import { safetyMessage } from '../lib/prompt'
import { getTaskById } from '../lib/registry'
import { pushRecentTask, setSession } from '../lib/storage'
import type { TaskAnswers, TaskDefinition } from '../types/task'

export function TaskRunner() {
  const { taskId = '' } = useParams()
  const navigate = useNavigate()
  const task = getTaskById(taskId)

  if (!task) {
    return (
      <Layout>
        <h1 className="page-title">Not found</h1>
        <p className="page-lead">Please choose a task from home.</p>
        <Link to="/" className="btn btn-primary btn-block">
          Go home
        </Link>
      </Layout>
    )
  }

  return <TaskRunnerView task={task} navigate={navigate} />
}

function TaskRunnerView({
  task,
  navigate,
}: {
  task: TaskDefinition
  navigate: ReturnType<typeof useNavigate>
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<TaskAnswers>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const field = task.inputs[step]
  const total = task.inputs.length
  const warning = useMemo(() => safetyMessage(task.safety), [task])
  const currentValue = field ? answers[field.id] : undefined

  function setValue(value: string | string[]) {
    if (!field) return
    setAnswers((prev) => ({ ...prev, [field.id]: value }))
  }

  function canContinue(): boolean {
    if (!field) return false
    const optional = field.required !== true
    if (field.type === 'photo') return true
    if (field.type === 'multiChoice') {
      const v = answers[field.id]
      const selected = Array.isArray(v) ? v : []
      return optional || selected.length > 0
    }
    const v = answers[field.id]
    if (optional) return true
    return Boolean(v && String(v).trim())
  }

  async function finish(nextAnswers: TaskAnswers) {
    setLoading(true)
    setError(null)
    try {
      const { text, usedDemo } = await generateHelp(task, nextAnswers)
      pushRecentTask(task.id)
      setSession({
        taskId: task.id,
        answers: nextAnswers,
        result: text,
        usedDemo,
      })
      navigate('/result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function onContinue() {
    if (!field) return
    if (step < total - 1) {
      setStep((s) => s + 1)
      return
    }
    await finish(answers)
  }

  if (loading) {
    return (
      <Layout showSaved={false}>
        <div className="loading" role="status" aria-live="polite">
          <div className="spinner" aria-hidden />
          <h2 className="page-title">Please wait…</h2>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showSaved={false}>
      <p className="step-label">
        Question {step + 1} of {total}
      </p>

      <div className="progress" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`progress-dot${i <= step ? ' on' : ''}`} />
        ))}
      </div>

      <div className="field-screen">
        <h1 className="page-title">{field?.label}</h1>
        {field?.helpText && <p className="page-lead">{field.helpText}</p>}

        {field &&
          (field.type === 'singleChoice' || field.type === 'multiChoice') && (
            <ChoiceField
              field={field}
              value={currentValue ?? (field.type === 'multiChoice' ? [] : '')}
              onChange={setValue}
            />
          )}

        {field &&
          (field.type === 'shortText' ||
            field.type === 'longText' ||
            field.type === 'voiceText') && (
            <VoiceTextField
              value={typeof currentValue === 'string' ? currentValue : ''}
              onChange={setValue}
              placeholder={field.placeholder}
              rows={field.type === 'shortText' ? 3 : 5}
            />
          )}

        {field?.type === 'photo' && (
          <PhotoField
            value={typeof currentValue === 'string' ? currentValue : ''}
            onChange={setValue}
          />
        )}

        {warning && step === 0 && <div className="warn-banner">{warning}</div>}
        {error && <p className="error-line">{error}</p>}
      </div>

      <div className="footer-nav">
        {step === 0 ? (
          <Link to="/" className="btn btn-secondary">
            Back
          </Link>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canContinue()}
          onClick={onContinue}
        >
          {step === total - 1 ? 'Get help' : 'Next'}
        </button>
      </div>
    </Layout>
  )
}
