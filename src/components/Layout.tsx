import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

export function Layout({
  children,
  showSaved = true,
}: {
  children: ReactNode
  showSaved?: boolean
}) {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <div className="app-shell">
      <header className="topbar">
        {onHome ? (
          <p className="brand">Daywise</p>
        ) : (
          <Link to="/" className="brand brand-link">
            Daywise
          </Link>
        )}
        {!onHome && showSaved && (
          <Link to="/" className="text-link">
            Home
          </Link>
        )}
      </header>
      {children}
    </div>
  )
}
