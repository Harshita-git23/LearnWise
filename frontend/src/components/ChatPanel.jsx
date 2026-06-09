import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, AlertCircle, Lock, FileText } from 'lucide-react'
import { chat } from '../api'
import { useApp } from '../context/AppContext'

export default function ChatPanel() {
  const { documentId, filename } = useApp()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setError(null)
    setMessages(m => [...m, { role: 'user', text: q }])
    setLoading(true)
    try {
      const history = messages.slice(-6)

      const res = await chat(
        documentId,
        q,
        history
      )
      setMessages(m => [...m, { role: 'ai', text: res.answer, sources: res.sources }])
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to get response.')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (!documentId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text-muted)' }}>
        <Lock size={28} />
        <p style={{ fontSize: '0.875rem' }}>Upload a PDF to start chatting</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent-soft)', border: '1px solid rgba(107,140,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={13} color="var(--accent)" />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1 }}>{filename}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Ask anything about this document</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-soft)', border: '1px solid rgba(107,140,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Bot size={22} color="var(--accent)" />
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 8 }}>Chat with your document</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.65 }}>
              Ask questions, get summaries, request explanations.<br />
              Every answer is grounded in your document.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {['Summarize this document', 'What are the key conclusions?', 'List the main topics covered'].map(s => (
                <button key={s} onClick={() => setInput(s)} style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 100, padding: '5px 12px', fontSize: '0.75rem',
                  color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => e.target.style.borderColor = 'rgba(107,140,255,0.3)'}
                  onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in" style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: msg.role === 'user' ? 'var(--accent-soft)' : 'var(--surface-2)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(107,140,255,0.2)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {msg.role === 'user' ? <User size={14} color="var(--accent)" /> : <Bot size={14} color="var(--text-secondary)" />}
            </div>
            <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div className={msg.role === 'user' ? 'msg-user' : 'msg-ai'} style={{
                borderRadius: msg.role === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                padding: '10px 14px', fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {msg.sources.map((s, j) => (
                    <span key={j} style={{
                      fontSize: '0.7rem', color: 'var(--accent)', background: 'var(--accent-soft)',
                      border: '1px solid rgba(107,140,255,0.15)', borderRadius: 4, padding: '2px 6px',
                    }}>§ {s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color="var(--text-secondary)" />
            </div>
            <div className="msg-ai" style={{ padding: '12px 14px', borderRadius: '10px 10px 10px 3px', display: 'flex', gap: 5, alignItems: 'center' }}>
              <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
            </div>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.8125rem', color: '#f87171' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question about your document…"
            rows={1}
            className="input-field"
            style={{ resize: 'none', flex: 1, lineHeight: 1.5, maxHeight: 120, overflow: 'auto' }}
          />
          <button onClick={send} disabled={!input.trim() || loading} className="btn-primary" style={{ flexShrink: 0, padding: '0 14px', alignSelf: 'flex-end', height: 38 }}>
            <Send size={15} />
          </button>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6 }}>Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}
