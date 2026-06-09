import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { uploadPDF } from '../api'
import { useApp } from '../context/AppContext'

export default function UploadPanel() {
  const { setDocument, filename, chunks, clearDocument, documentId } = useApp()
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      return
    }
    setSelectedFile(file)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)
    try {
      const res = await uploadPDF(selectedFile)
      setDocument(res)
      setSelectedFile(null)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Upload failed. Check your backend connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  if (documentId) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 520, margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
            background: 'rgba(62,207,207,0.1)', border: '1px solid rgba(62,207,207,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={24} color="#3ecfcf" />
          </div>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 6 }}>Document Loaded</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: 4 }}>{filename}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 24 }}>{chunks} chunks indexed</p>

          <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Document ID</p>
            <code style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>{documentId}</code>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: 20 }}>
            All features are now unlocked. Use the sidebar to chat, generate quizzes, flashcards, or diagrams.
          </p>

          <button onClick={clearDocument} className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
            <X size={14} /> Upload Different PDF
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Upload a PDF</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>Upload your document to unlock AI chat, quizzes, flashcards, and visual diagrams.</p>
      </div>

      <div
        className={`card`}
        onClick={() => !loading && fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
          borderColor: dragging ? 'var(--accent)' : selectedFile ? 'rgba(62,207,207,0.4)' : undefined,
          boxShadow: dragging ? '0 0 0 3px rgba(107,140,255,0.1)' : undefined,
          transition: 'all 0.2s',
        }}
      >
        <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 16px',
          background: selectedFile ? 'rgba(62,207,207,0.1)' : 'var(--accent-soft)',
          border: `1px solid ${selectedFile ? 'rgba(62,207,207,0.3)' : 'rgba(107,140,255,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {selectedFile ? <FileText size={24} color="#3ecfcf" /> : <Upload size={24} color="var(--accent)" />}
        </div>

        {selectedFile ? (
          <>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: 4 }}>{selectedFile.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              {dragging ? 'Drop your PDF here' : 'Drag & drop or click to browse'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF files only</p>
          </>
        )}
      </div>

      {error && (
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-start',
          marginTop: 12, padding: '10px 14px',
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 8, fontSize: '0.8125rem', color: '#f87171',
        }}>
          <AlertCircle size={14} style={{ marginTop: 2, flexShrink: 0 }} /> {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '0.75rem' }}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: 15, height: 15 }} />
            Uploading & indexing…
          </>
        ) : (
          <>
            <Upload size={15} /> Upload PDF
          </>
        )}
      </button>
    </div>
  )
}
