import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { getTaskById } from '../lib/registry'

/** Keep the home list short — one clear choice per row. */
const HOME_TASK_IDS = [
  'write-message',
  'explain-letter',
  'shopping-list',
  'doctor-questions',
  'life-story',
  'tech-howto',
]

export function Home() {
  const tasks = HOME_TASK_IDS.map((id) => getTaskById(id)).filter(Boolean)
  const somethingElse = getTaskById('something-else')

  return (
    <Layout>
      <h1 className="page-title">What do you need help with?</h1>
      <p className="page-lead">Tap one.</p>

      <nav className="task-list" aria-label="Tasks">
        {tasks.map(
          (task) =>
            task && (
              <Link key={task.id} to={`/task/${task.id}`} className="task-btn">
                {task.title}
              </Link>
            ),
        )}

        {somethingElse && (
          <Link to={`/task/${somethingElse.id}`} className="task-btn task-btn-other">
            Something else
          </Link>
        )}
      </nav>

      <p className="home-footer">
        <Link to="/saved">My saved help</Link>
      </p>
    </Layout>
  )
}
