import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [documentId, setDocumentId] = useState(null)
  const [filename, setFilename] = useState(null)
  const [chunks, setChunks] = useState(null)

  const setDocument = (doc) => {
    setDocumentId(doc.document_id)
    setFilename(doc.filename)
    setChunks(doc.chunks)
  }

  const clearDocument = () => {
    setDocumentId(null)
    setFilename(null)
    setChunks(null)
  }

  return (
    <AppContext.Provider value={{ documentId, filename, chunks, setDocument, clearDocument }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be within AppProvider')
  return ctx
}
