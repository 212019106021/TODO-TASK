'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Todo {
  id: number
  title: string
  completed: boolean
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const loadTodos = async () => {
    setLoading(true)
    try {
      const response = await api.get<Todo[]>('/todos')
      setTodos(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleAdd = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    try {
      const response = await api.post<Todo>('/todos', { title: trimmedTitle })
      setTodos([response.data, ...todos])
      setTitle('')
    } catch (error) {
      console.error(error)
    }
  }

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await api.put<Todo>(`/todos/${todo.id}`, {
        completed: !todo.completed,
      })
      setTodos(todos.map((item) => (item.id === todo.id ? response.data : item)))
    } catch (error) {
      console.error(error)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id)
    setEditingTitle(todo.title)
  }

  const cancelEditing = () => {
    setEditingTodoId(null)
    setEditingTitle('')
  }

  const saveEdit = async (todo: Todo) => {
    const trimmedTitle = editingTitle.trim()
    if (!trimmedTitle || trimmedTitle === todo.title) {
      cancelEditing()
      return
    }

    console.log('saveEdit', todo.id, trimmedTitle)

    try {
      await api.put<Todo>(`/todos/${todo.id}`, {
        title: trimmedTitle,
      })
      await loadTodos()
      cancelEditing()
    } catch (error) {
      console.error('saveEdit error', error)
    }
  }

  const deleteTodo = async (todoId: number) => {
    try {
      await api.delete(`/todos/${todoId}`)
      setTodos(todos.filter((item) => item.id !== todoId))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Todo List</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Todo List</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="todo-input" className="sr-only">
            New task
          </label>
          <input
            id="todo-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleAdd()}
            placeholder="Add a new task"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Add
          </button>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
              No tasks yet. Add one above.
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li key={todo.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400"
                      >
                        {todo.completed ? '☑' : '☐'}
                      </button>
                      <div className="min-w-0">
                        {editingTodoId === todo.id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(event) => setEditingTitle(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                          />
                        ) : (
                          <p className="text-base font-medium text-slate-900">{todo.title}</p>
                        )}
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            todo.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingTodoId === todo.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveEdit(todo)}
                            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditing(todo)}
                          className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
