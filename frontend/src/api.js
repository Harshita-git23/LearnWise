import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL })

export async function uploadPDF(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function chat(
  document_id,
  question,
  history = []
) {

  const { data } =
    await api.post(
      '/chat',
      {
        document_id,
        question,
        history
      }
    )

  return data
}

export async function generateQuiz(document_id, topic, difficulty, num_questions) {
  const { data } = await api.post('/quiz', { document_id, topic, difficulty, num_questions })
  return data
}

export async function generateFlashcards(document_id, topic) {
  const { data } = await api.post('/flashcards', { document_id, topic })
  return data
}

export async function generateDiagram(
  document_id,
  topic
) {
  const { data } = await api.post(
    '/diagrams',
    {
      document_id,
      topic
    }
  )

  return data
}
