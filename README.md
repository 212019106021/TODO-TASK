# Todo List App

A simple full-stack Todo List application built with Next.js 15, TypeScript, Tailwind CSS, FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- Add a new task
- Show all tasks
- Mark a task as Completed or Pending
- Delete a task

## Run the project

Make sure Docker is installed, then run:

```bash
docker compose up --build
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## Backend API

- `GET /todos` → Get all tasks
- `POST /todos` → Create a task
- `PUT /todos/{id}` → Update task status
- `DELETE /todos/{id}` → Delete a task

## Database

The app uses PostgreSQL with a `todos` table that includes:

- `id`
- `title`
- `completed`
