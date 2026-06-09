import { useState } from 'react'
import { Zap, Lock, AlertCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { generateFlashcards } from '../api'
import { useApp } from '../context/AppContext'

export default function FlashcardsPanel() {
  const { documentId } = useApp()
  const [topic, setTopic] = useState('')
  const [cards, setCards] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(new Set())

  const generate = async () => {
    setLoading(true); setError(null); setCards(null); setCurrent(0); setFlipped(false); setKnown(new Set())
    try {
      const res = await generateFlashcards(documentId, topic)
      setCards(res.flashcards)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to generate flashcards.')
    } finally {
      setLoading(false)
    }
  }

  const prev = () => { setFlipped(false); setTimeout(() => setCurrent(c => Math.max(0, c - 1)), 150) }
  const next = () => { setFlipped(false); setTimeout(() => setCurrent(c => Math.min(cards.length - 1, c + 1)), 150) }
  const markKnown = () => { setKnown(s => new Set([...s, current])); next() }

  if (!documentId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text-muted)' }}>
        <Lock size={28} />
        <p style={{ fontSize: '0.875rem' }}>Upload a PDF to generate flashcards</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Flashcards</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Interactive flip cards for active recall</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic or concept to make cards for…" className="input-field" style={{ flex: 1 }} />
          <button onClick={generate} disabled={loading} className="btn-primary">
            {loading ? <div className="spinner" style={{ width: 15, height: 15 }} /> : <><Zap size={15} /> Generate</>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.8125rem', color: '#f87171', marginBottom: 20 }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {cards && cards.length > 0 && (
        <div className="animate-fade-in">
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{current + 1} / {cards.length}</span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#3ecfcf' }}>{known.size} known</span>
              <button onClick={() => { setCurrent(0); setFlipped(false); setKnown(new Set()) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 100, marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((current + 1) / cards.length) * 100}%`, background: 'var(--accent)', borderRadius: 100, transition: 'width 0.3s ease' }} />
          </div>

          {/* Card */}
          <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}
            style={{ height: 260, marginBottom: 20 }}>
            <div className="flip-card-inner">
              <div className="flip-card-front" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ position: 'absolute', top: 14, left: 16, fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Question</div>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', lineHeight: 1.55, textAlign: 'center', color: 'var(--text-primary)' }}>{cards[current].question}</p>
                <div style={{ position: 'absolute', bottom: 14, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tap to reveal answer</div>
              </div>
              <div className="flip-card-back" style={{ background: 'var(--surface-2)', border: '1px solid rgba(107,140,255,0.2)' }}>
                <div style={{ position: 'absolute', top: 14, left: 16, fontSize: '0.7rem', color: '#3ecfcf', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Answer</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, textAlign: 'center', color: 'var(--text-primary)' }}>{cards[current].answer}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={prev} disabled={current === 0} className="btn-ghost">
              <ChevronLeft size={15} /> Prev
            </button>
            {flipped && (
              <button onClick={markKnown} style={{
                background: 'rgba(62,207,207,0.1)', border: '1px solid rgba(62,207,207,0.3)',
                color: '#3ecfcf', borderRadius: 8, padding: '0.625rem 1rem', fontSize: '0.875rem',
                fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                Got it ✓
              </button>
            )}
            <button onClick={next} disabled={current === cards.length - 1} className="btn-ghost">
              Next <ChevronRight size={15} />
            </button>
          </div>

          {/* Card dots */}
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            {cards.map((_, i) => (
              <div key={i} onClick={() => { setFlipped(false); setCurrent(i) }} style={{
                width: 7, height: 7, borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s',
                background: known.has(i) ? '#3ecfcf' : i === current ? 'var(--accent)' : 'var(--surface-2)',
                border: i === current ? '1px solid var(--accent)' : '1px solid var(--border)',
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
