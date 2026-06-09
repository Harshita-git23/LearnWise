import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  BookOpen, ArrowRight, Upload, MessageSquare,
  Brain, Zap, GitBranch, Sparkles, ChevronDown
} from 'lucide-react'

function useInView(threshold = 0.25) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ── Step 1 — PDF Metamorphosis visual ── */
function PDFtoMindmap({ active }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    if (!active) return
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 1900),
    ]
    return () => timers.forEach(clearTimeout)
  }, [active])

  return (
    <div style={{ position: 'relative', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* PDF box */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(${phase >= 2 ? '-200px' : '-50%'}, -50%)`,
        transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
        opacity: phase >= 3 ? 0.4 : 1,
      }}>
        <div style={{
          width: 110, padding: '1rem', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 12,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 42, height: 54, background: '#1e1e2a', border: '1px solid #3a3a5a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, background: '#0d0d14', borderLeft: '1px solid #3a3a5a', borderBottom: '1px solid #3a3a5a', borderRadius: '0 4px 0 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[80, 60, 70, 50].map((w, i) => <div key={i} style={{ height: 2, width: w * 0.22, background: '#3a3a5a', borderRadius: 1 }} />)}
            </div>
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>research.pdf</span>
        </div>
      </div>

      {/* Scanning particles */}
      {phase >= 1 && phase < 3 && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', width: 4, height: 4, borderRadius: '50%',
              background: i % 2 === 0 ? '#6b8cff' : '#3ecfcf',
              top: `${20 + Math.sin(i * 0.8) * 35}%`,
              left: `${15 + (i / 7) * 70}%`,
              opacity: phase >= 2 ? 0 : 0.8,
              transition: `opacity 0.4s ${i * 0.06}s, transform 0.6s ${i * 0.06}s`,
              transform: phase >= 2 ? 'scale(0) translateY(-20px)' : 'scale(1)',
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0,
            border: '1px dashed rgba(107,140,255,0.2)',
            borderRadius: '50%',
            opacity: phase >= 2 ? 0 : 0.6,
            transition: 'opacity 0.5s',
            animation: phase === 1 ? 'spin 3s linear infinite' : 'none',
          }} />
        </div>
      )}

      {/* Output nodes */}
      {phase >= 2 && [
        { label: 'AI Chat',    icon: MessageSquare, color: '#6b8cff', x: 80,  y: 50  },
        { label: 'Quiz',       icon: Brain,         color: '#3ecfcf', x: 80,  y: 135 },
        { label: 'Flashcards', icon: Zap,           color: '#f4a261', x: 80,  y: 220 },
        { label: 'Diagram',    icon: GitBranch,     color: '#a78bfa', x: 190, y: 90  },
      ].map((node, i) => {
        const Icon = node.icon
        return (
          <div key={node.label} style={{
            position: 'absolute',
            left: `calc(50% + ${node.x}px)`, top: node.y,
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.8)',
            transition: `all 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1 + 0.1}s`,
          }}>
            {/* connector line */}
            <svg style={{ position: 'absolute', right: '100%', top: '50%', overflow: 'visible', pointerEvents: 'none' }} width="40" height="1">
              <line x1="0" y1="0" x2="40" y2="0" stroke={node.color} strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            </svg>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', borderRadius: 8,
              background: `${node.color}10`,
              border: `1px solid ${node.color}30`,
              whiteSpace: 'nowrap',
            }}>
              <Icon size={13} color={node.color} />
              <span style={{ fontSize: '0.72rem', color: node.color, fontWeight: 600 }}>{node.label}</span>
            </div>
          </div>
        )
      })}

      {/* Central hub after transformation */}
      {phase >= 3 && (
        <div style={{
          position: 'absolute', left: 'calc(50% + 50px)', top: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.5s',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--accent-soft)', border: '2px solid rgba(107,140,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={18} color="var(--accent)" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Chat step ── */
function ChatStep({ active }) {
  const [shown, setShown] = useState(0)
  const msgs = [
    { role: 'user', text: 'Summarize the key findings' },
    { role: 'ai',   text: 'The study identifies 3 core findings: transformer models outperform RNNs on long-range dependencies, attention heads specialize by layer depth, and pre-training corpus diversity is the strongest predictor of downstream performance.', sources: ['§ Section 4', '§ Table 2'] },
    { role: 'user', text: 'What dataset did they use?' },
    { role: 'ai',   text: 'They trained on a curated mix of BooksCorpus and Wikipedia — roughly 16GB of text — filtered for quality using a perplexity-based heuristic.', sources: ['§ Section 3.1'] },
  ]
  useEffect(() => {
    if (!active) return
    msgs.forEach((_, i) => {
      setTimeout(() => setShown(i + 1), i * 700 + 300)
    })
  }, [active])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', background: 'rgba(107,140,255,0.06)', border: '1px solid rgba(107,140,255,0.12)', borderRadius: 7, marginBottom: 4 }}>
        <BookOpen size={12} color="#6b8cff" />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>research-paper.pdf</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.62rem', color: '#3ecfcf', background: 'rgba(62,207,207,0.08)', border: '1px solid rgba(62,207,207,0.18)', borderRadius: 4, padding: '1px 5px' }}>ready</span>
      </div>
      {msgs.slice(0, shown).map((m, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.3s ease' }}>
          <div style={{
            maxWidth: '84%',
            background: m.role === 'user' ? 'rgba(107,140,255,0.1)' : 'var(--surface-2)',
            border: `1px solid ${m.role === 'user' ? 'rgba(107,140,255,0.18)' : 'var(--border)'}`,
            borderRadius: m.role === 'user' ? '11px 11px 3px 11px' : '11px 11px 11px 3px',
            padding: '8px 12px',
          }}>
            <p style={{ fontSize: '0.78rem', color: m.role === 'user' ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{m.text}</p>
            {m.sources && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                {m.sources.map((s, j) => (
                  <span key={j} style={{ fontSize: '0.62rem', color: '#6b8cff', background: 'rgba(107,140,255,0.07)', border: '1px solid rgba(107,140,255,0.14)', borderRadius: 4, padding: '1px 5px' }}>{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {shown < msgs.length && shown > 0 && shown % 2 === 1 && (
        <div style={{ display: 'flex' }}>
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '11px 11px 11px 3px', padding: '8px 12px', display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Quiz step ── */
function QuizStep({ active }) {
  const [sel, setSel] = useState(null)
  const [checked, setChecked] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (active) setTimeout(() => setVisible(true), 200) }, [active])
  const correct = 'B'
  const opts = [
    { k: 'A', t: 'Recurrent Neural Networks' },
    { k: 'B', t: 'Multi-head self-attention' },
    { k: 'C', t: 'Convolutional feature maps' },
    { k: 'D', t: 'Bag-of-words embeddings' },
  ]
  return (
    <div style={{ padding: '1rem', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px)', transition: 'all 0.4s' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#3ecfcf', background: 'rgba(62,207,207,0.07)', border: '1px solid rgba(62,207,207,0.18)', borderRadius: 4, padding: '2px 7px' }}>Generated · Medium · Q1 of 5</span>
      </div>
      <p style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, marginBottom: 12, color: 'var(--text-primary)' }}>
        What mechanism do transformers rely on instead of sequential processing?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {opts.map(o => {
          const isSel = sel === o.k
          const isOk  = checked && o.k === correct
          const isBad = checked && isSel && o.k !== correct
          return (
            <button key={o.k} onClick={() => !checked && setSel(o.k)} style={{
              textAlign: 'left', display: 'flex', gap: 8, alignItems: 'center',
              padding: '8px 10px', borderRadius: 7, cursor: checked ? 'default' : 'pointer',
              background: isOk ? 'rgba(62,207,207,0.07)' : isBad ? 'rgba(239,68,68,0.06)' : isSel ? 'rgba(107,140,255,0.07)' : 'var(--surface-2)',
              border: `1px solid ${isOk ? 'rgba(62,207,207,0.3)' : isBad ? 'rgba(239,68,68,0.25)' : isSel ? 'rgba(107,140,255,0.28)' : 'var(--border)'}`,
              transition: 'all 0.15s', fontSize: '0.78rem', color: 'var(--text-primary)',
            }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700, background: isOk ? 'rgba(62,207,207,0.15)' : isBad ? 'rgba(239,68,68,0.15)' : isSel ? 'rgba(107,140,255,0.15)' : 'var(--surface)', border: `1px solid ${isOk ? '#3ecfcf' : isBad ? '#f87171' : isSel ? '#6b8cff' : 'var(--border)'}`, color: isOk ? '#3ecfcf' : isBad ? '#f87171' : isSel ? '#6b8cff' : 'var(--text-muted)' }}>{o.k}</span>
              {o.t}
            </button>
          )
        })}
      </div>
      <button onClick={() => checked ? (setChecked(false), setSel(null)) : setChecked(true)}
        disabled={!sel}
        style={{ marginTop: 10, width: '100%', padding: '8px', borderRadius: 7, fontSize: '0.78rem', fontWeight: 500, cursor: sel ? 'pointer' : 'not-allowed', background: checked ? 'var(--surface-2)' : 'var(--accent)', color: checked ? 'var(--text-secondary)' : 'white', border: `1px solid ${checked ? 'var(--border)' : 'transparent'}`, opacity: sel ? 1 : 0.45, transition: 'all 0.15s' }}>
        {checked ? 'Try again' : 'Check answer'}
      </button>
    </div>
  )
}

/* ── Flashcard step ── */
function FlashcardStep({ active }) {
  const [flipped, setFlipped] = useState(false)
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (active) setTimeout(() => setVisible(true), 200) }, [active])
  const cards = [
    { q: 'What is self-attention?', a: 'A mechanism where each token computes a weighted sum over all other tokens, letting the model capture global context in one step.' },
    { q: 'Define positional encoding', a: 'A signal added to token embeddings that encodes absolute or relative position, since transformers process all tokens simultaneously.' },
    { q: 'What is a feed-forward sublayer?', a: 'A two-layer MLP applied identically to each position — expands dimensionality, applies non-linearity, then projects back.' },
  ]
  const next = () => { setFlipped(false); setTimeout(() => setIdx(i => (i + 1) % cards.length), 220) }
  return (
    <div style={{ padding: '1rem', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Card {idx + 1} / {cards.length}</span>
        <span style={{ fontSize: '0.65rem', color: '#f4a261', background: 'rgba(244,162,97,0.07)', border: '1px solid rgba(244,162,97,0.18)', borderRadius: 4, padding: '2px 7px' }}>Tap to flip</span>
      </div>
      <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 100, marginBottom: 14 }}>
        <div style={{ height: '100%', width: `${((idx + 1) / cards.length) * 100}%`, background: '#f4a261', borderRadius: 100, transition: 'width 0.3s' }} />
      </div>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)} style={{ height: 150 }}>
        <div className="flip-card-inner">
          <div className="flip-card-front" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div style={{ position: 'absolute', top: 10, left: 12, fontSize: '0.6rem', color: '#f4a261', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Question</div>
            <p style={{ fontSize: '0.82rem', fontWeight: 500, textAlign: 'center', lineHeight: 1.5, color: 'var(--text-primary)' }}>{cards[idx].q}</p>
          </div>
          <div className="flip-card-back" style={{ background: 'rgba(244,162,97,0.05)', border: '1px solid rgba(244,162,97,0.22)' }}>
            <div style={{ position: 'absolute', top: 10, left: 12, fontSize: '0.6rem', color: '#f4a261', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Answer</div>
            <p style={{ fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{cards[idx].a}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
        <button onClick={next} style={{ flex: 1, padding: '7px', borderRadius: 7, background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.22)', color: '#f4a261', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>Next →</button>
        {flipped && <button style={{ flex: 1, padding: '7px', borderRadius: 7, background: 'rgba(62,207,207,0.07)', border: '1px solid rgba(62,207,207,0.2)', color: '#3ecfcf', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>Got it ✓</button>}
      </div>
    </div>
  )
}

/* ── Diagram step ── */
function DiagramStep({ active }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (active) setTimeout(() => setVisible(true), 200) }, [active])
  return (
    <div style={{ padding: '1rem', opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: '0.65rem', color: '#a78bfa', background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)', borderRadius: 4, padding: '2px 7px' }}>Auto-generated · Transformer Architecture</span>
      </div>
      <svg viewBox="0 0 310 180" style={{ width: '100%', height: 'auto', fontFamily: 'DM Sans, sans-serif' }}>
        <defs>
          <marker id="ah" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L5,2.5 z" fill="#3a3a5a" />
          </marker>
          <marker id="ahp" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L5,2.5 z" fill="#a78bfa" />
          </marker>
        </defs>
        {/* Encoder column */}
        {[
          { y: 158, label: 'Input tokens',     col: '#252535', tc: '#8080a0' },
          { y: 122, label: 'Embedding + PE',   col: '#252535', tc: '#8080a0' },
          { y: 86,  label: 'Self-attention',   col: 'rgba(107,140,255,0.14)', tc: '#6b8cff' },
          { y: 50,  label: 'Feed-forward',     col: '#252535', tc: '#8080a0' },
          { y: 14,  label: 'Encoder output',   col: 'rgba(62,207,207,0.1)', tc: '#3ecfcf' },
        ].map((b, i) => (
          <g key={i} style={{ opacity: visible ? 1 : 0, transition: `opacity 0.4s ${i * 0.08}s` }}>
            {i < 4 && <line x1="55" y1={b.y - 8} x2="55" y2={b.y - 22} stroke="#3a3a5a" strokeWidth="1.2" markerEnd="url(#ah)" />}
            <rect x="5" y={b.y - 11} width="100" height="22" rx="5" fill={b.col} stroke={b.tc === '#8080a0' ? '#3a3a5a' : b.tc} strokeWidth="1" />
            <text x="55" y={b.y + 4} textAnchor="middle" fontSize="7.5" fill={b.tc}>{b.label}</text>
          </g>
        ))}
        {/* Decoder column */}
        {[
          { y: 158, label: 'Target tokens',    col: '#252535', tc: '#8080a0' },
          { y: 122, label: 'Embedding + PE',   col: '#252535', tc: '#8080a0' },
          { y: 86,  label: 'Cross-attention',  col: 'rgba(167,139,250,0.14)', tc: '#a78bfa' },
          { y: 50,  label: 'Feed-forward',     col: '#252535', tc: '#8080a0' },
          { y: 14,  label: 'Output probs',     col: 'rgba(244,162,97,0.1)', tc: '#f4a261' },
        ].map((b, i) => (
          <g key={i} style={{ opacity: visible ? 1 : 0, transition: `opacity 0.4s ${i * 0.08 + 0.3}s` }}>
            {i < 4 && <line x1="205" y1={b.y - 8} x2="205" y2={b.y - 22} stroke="#3a3a5a" strokeWidth="1.2" markerEnd="url(#ah)" />}
            <rect x="155" y={b.y - 11} width="100" height="22" rx="5" fill={b.col} stroke={b.tc === '#8080a0' ? '#3a3a5a' : b.tc} strokeWidth="1" />
            <text x="205" y={b.y + 4} textAnchor="middle" fontSize="7.5" fill={b.tc}>{b.label}</text>
          </g>
        ))}
        {/* Cross-attention connector */}
        <line x1="105" y1="86" x2="155" y2="86" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#ahp)" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s 0.7s' }} />
        <text x="130" y="80" textAnchor="middle" fontSize="6.5" fill="#a78bfa" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s 0.8s' }}>cross attn</text>
        {/* Column labels */}
        <text x="55"  y="175" textAnchor="middle" fontSize="7" fill="#3a3a5a" fontWeight="600" letterSpacing="0.5">ENCODER</text>
        <text x="205" y="175" textAnchor="middle" fontSize="7" fill="#3a3a5a" fontWeight="600" letterSpacing="0.5">DECODER</text>
      </svg>
    </div>
  )
}

/* ── Scroll step component ── */
function ScrollStep({ step, index, total }) {
  const [ref, inView] = useInView(0.3)
  const isLast = index === total - 1

  const previewComponents = {
    upload: PDFtoMindmap,
    chat: ChatStep,
    quiz: QuizStep,
    flashcard: FlashcardStep,
    diagram: DiagramStep,
  }
  const Preview = previewComponents[step.id]

  return (
    <div ref={ref} style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center',
      padding: '5rem 0', maxWidth: 1060, margin: '0 auto',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      {/* Left — text */}
      <div style={{
        opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)',
        transition: 'all 0.65s cubic-bezier(0.4,0,0.2,1)',
        order: index % 2 === 0 ? 0 : 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `${step.color}12`, border: `1px solid ${step.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <step.icon size={16} color={step.color} />
          </div>
          <span style={{ fontSize: '0.7rem', color: step.color, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Step {index + 1}</span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: 16, color: 'var(--text-primary)' }}>
          {step.heading}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20, maxWidth: 400 }}>{step.desc}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {step.bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: step.color, flexShrink: 0, marginTop: 7 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — product visual */}
      <div style={{
        opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(32px)',
        transition: 'all 0.65s cubic-bezier(0.4,0,0.2,1) 0.12s',
        order: index % 2 === 0 ? 1 : 0,
      }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${step.color}55, transparent)` }} />
          {/* Window chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
            <span style={{ marginLeft: 6, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>PDFMind AI — {step.label}</span>
          </div>
          <Preview active={inView} />
        </div>
      </div>
    </div>
  )
}

/* ── STEPS data ── */
const STEPS = [
  {
    id: 'upload',
    label: 'Upload',
    icon: Upload,
    color: '#6b8cff',
    heading: 'Turn any PDF into a study workspace.',
    desc: 'Upload lecture notes, textbooks, research papers, or documentation in PDF and organizes the content and prepares it for instant search, learning, and revision.',
    bullets: [
      'Fast document processing and indexing',
      'Works with textbooks, notes, papers, and manuals',
    ],
  },

  {
    id: 'chat',
    label: 'AI Chat',
    icon: MessageSquare,
    color: '#6b8cff',
    heading: 'Learn through conversation.',
    desc: 'Ask questions, request explanations, or dive deeper into a topic. The AI uses your document as context to provide focused answers.',
    bullets: [
      'Supports follow-up questions and discussions',
      'Summarize, explain, compare, and clarify concepts',
    ],
  },

  {
    id: 'quiz',
    label: 'Quiz',
    icon: Brain,
    color: '#3ecfcf',
    heading: 'Practice what you’ve learned.',
    desc: 'Generate quizzes directly from your study material. Test your understanding, identify weak areas, and reinforce key concepts.',
    bullets: [
      'Choose difficulty levels',
      'Instant scoring and feedback',
      'Generate quizzes for specific topics',
    ],
  },

  {
    id: 'flashcard',
    label: 'Flashcards',
    icon: Zap,
    color: '#f4a261',
    heading: 'Memorize smarter.',
    desc: 'Convert important concepts into concise flashcards designed for active recall and faster revision.',
    bullets: [
      'Focused question–answer format',
      'Quick review sessions before exams',
      'Generate cards from any section of your notes',
    ],
  },

  {
    id: 'diagram',
    label: 'Diagram',
    icon: GitBranch,
    color: '#a78bfa',
    heading: 'Visualize complex ideas.',
    desc: 'Transform concepts into diagrams, flowcharts, and process maps to understand relationships and workflows more clearly.',
    bullets: [
      'Generate diagrams from document content',
      'Export diagrams as SVG',
      'Great for systems, processes, and workflows',
    ],
  },
]

/* ── MAIN ── */
export default function LandingPage() {
  const navigate = useNavigate()
  const [heroRef, heroInView] = useInView(0.1)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(14px)',
        backgroundColor: 'rgba(13,13,20,0.88)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={13} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' }}>LearnWise</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <a href="#steps" className="btn-ghost" style={{ fontSize: '0.8rem' }}>How it works</a>
            <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ fontSize: '0.8rem' }}>
              Get Started <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO — full viewport, single focused statement ── */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 2rem 60px',
        position: 'relative',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(107,140,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="animate-fade-up stagger-1" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--accent-soft)', border: '1px solid rgba(107,140,255,0.18)',
          borderRadius: 100, padding: '4px 12px', marginBottom: 28,
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          <Sparkles size={9} /> Turn PDFs into study tools
        </div>

        <h1 className="animate-fade-up stagger-2" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          maxWidth: 780,
        }}>
          Interactive Reading,{' '}
          <span className="shimmer-text">Accelerated</span>
        </h1>

        <p className="animate-fade-up stagger-3" style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)', lineHeight: 1.7,
          maxWidth: 540, marginBottom: 40,
        }}>
          Upload any PDF and turn it into an AI conversation, a quiz, a deck of flashcards, and a visual diagram in one place.
        </p>

        <div className="animate-fade-up stagger-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.75rem 1.75rem' }}>
            Open Dashboard <ArrowRight size={15} />
          </button>
          <a href="#steps" className="btn-ghost" style={{ fontSize: '0.9375rem', padding: '0.75rem 1.5rem' }}>
            See how it works
          </a>
        </div>

        {/* Feature strip */}
        <div className="animate-fade-up stagger-5" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Chat with your PDF',    color: '#6b8cff', icon: MessageSquare },
            { label: 'Auto-generate quizzes', color: '#3ecfcf', icon: Brain },
            { label: 'Flip flashcards',       color: '#f4a261', icon: Zap },
            { label: 'Visual diagrams',       color: '#a78bfa', icon: GitBranch },
          ].map(f => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 100,
              background: `${f.color}0e`, border: `1px solid ${f.color}22`,
              fontSize: '0.73rem', color: f.color, fontWeight: 500,
            }}>
              <f.icon size={11} /> {f.label}
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, opacity: 0.4 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Scroll to explore</span>
          <ChevronDown size={14} color="var(--text-muted)" style={{ animation: 'fadeUp 1.5s ease infinite alternate' }} />
        </div>
      </section>

      {/* ── SCROLL STEPS ── */}
      <section id="steps" style={{ padding: '0 2rem' }}>
        {STEPS.map((step, i) => (
          <ScrollStep key={step.id} step={step} index={i} total={STEPS.length} />
        ))}
      </section>

      {/* ── FINAL CTA — stripped back ── */}
      <section style={{ padding: '80px 2rem 110px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          marginBottom: 14
        }}>
          From PDFs to Knowledge.
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          marginBottom: 32
        }}>
          Chat with your documents, generate quizzes, create flashcards, and understand concepts faster.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
          style={{
            fontSize: '0.9375rem',
            padding: '0.75rem 2rem'
          }}
        >
          Try LearnWise <ArrowRight size={15} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 2rem', maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={10} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '0.85rem' }}>LearnWise</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>LearnWise. Built with curiosity.</p>
      </footer>
    </div>
  )
}
