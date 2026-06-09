import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, MessageSquare, Brain, Zap, GitBranch, BookOpen, ArrowLeft, FileText, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import UploadPanel from '../components/UploadPanel'
import ChatPanel from '../components/ChatPanel'
import QuizPanel from '../components/QuizPanel'
import FlashcardsPanel from '../components/FlashcardsPanel'
import DiagramPanel from '../components/DiagramPanel'

const navItems = [
  { id: 'upload', label: 'Upload PDF', icon: Upload },
  { id: 'chat', label: 'Chat', icon: MessageSquare, requiresDoc: true },
  { id: 'quiz', label: 'Quiz', icon: Brain, requiresDoc: true },
  { id: 'flashcards', label: 'Flashcards', icon: Zap, requiresDoc: true },
  { id: 'diagram', label: 'Diagram', icon: GitBranch, requiresDoc: true },
]

const panelMap = {
  upload: UploadPanel,
  chat: ChatPanel,
  quiz: QuizPanel,
  flashcards: FlashcardsPanel,
  diagram: DiagramPanel,
}

const panelDescriptions = {
  upload: 'Upload & Index',
  chat: 'AI Chat',
  quiz: 'Quiz Generator',
  flashcards: 'Flashcards',
  diagram: 'Visual Diagram',
}

export default function Dashboard() {
  const [active, setActive] = useState('upload')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { documentId, filename } = useApp()

  const Panel = panelMap[active]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.25s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', marginBottom: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={14} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' }}>LearnWise</span>
          </Link>

          {/* Back link */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={12} /> Back to home
          </Link>
        </div>

        {/* Document badge */}
        {documentId && (
          <div style={{ margin: '10px', padding: '8px 10px', background: 'rgba(62,207,207,0.06)', border: '1px solid rgba(62,207,207,0.15)', borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <FileText size={12} color="#3ecfcf" style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.7rem', color: '#3ecfcf', fontWeight: 600, marginBottom: 1 }}>Active Document</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filename}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 8px 6px' }}>Tools</p>

          {navItems.map(item => {
            const isActive = active === item.id
            const locked = item.requiresDoc && !documentId

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', borderRadius: 8,
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(107,140,255,0.2)' : 'transparent'}`,
                  color: isActive ? 'var(--accent)' : locked ? 'var(--text-muted)' : 'var(--text-secondary)',
                  fontSize: '0.8125rem', fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <item.icon size={15} />
                  {item.label}
                </span>
                {locked && <span style={{ fontSize: '0.6rem', background: 'var(--surface-2)', borderRadius: 4, padding: '1px 5px', color: 'var(--text-muted)' }}>Upload first</span>}
                {isActive && !locked && <ChevronRight size={12} />}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ height: 52, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', paddingInline: '1.5rem', flexShrink: 0, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {(() => { const Item = navItems.find(n => n.id === active); return Item ? <Item.icon size={15} color="var(--accent)" /> : null })()}
            <h1 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{panelDescriptions[active]}</h1>
          </div>
        </div>

        {/* Panel content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: active === 'chat' ? 0 : '2rem 2rem'
          }}
        >
          <Panel
            key={active}
            documentId={documentId}
          />
        </div>
      </div>
    </div>
  )
}
