import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { deleteSaved, loadSaved } from '../lib/storage'
import { speakText, stopSpeaking } from '../lib/speech'

export function Saved() {
  const [items, setItems] = useState(() => loadSaved())

  return (
    <Layout>
      <h1 className="page-title">My saved help</h1>

      {items.length === 0 && (
        <p className="page-lead">Nothing saved yet.</p>
      )}

      {items.map((item) => (
        <article key={item.id} className="saved-item">
          <strong>{item.taskTitle}</strong>
          <time dateTime={item.createdAt}>
            {new Date(item.createdAt).toLocaleString('en-GB', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </time>
          <p className="saved-preview">
            {item.result.length > 180 ? `${item.result.slice(0, 180)}…` : item.result}
          </p>
          <div className="saved-actions">
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => {
                stopSpeaking()
                speakText(item.result)
              }}
            >
              Read aloud
            </button>
            <button
              type="button"
              className="text-link-btn"
              onClick={() => {
                deleteSaved(item.id)
                setItems(loadSaved())
              }}
            >
              Delete
            </button>
          </div>
        </article>
      ))}

      <Link to="/" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>
        Go home
      </Link>
    </Layout>
  )
}
