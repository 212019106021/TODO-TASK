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
copy .env.example .env
docker compose up --build
```

Update the values in `.env` before starting the services if you need different database, pgAdmin, or API settings. The local `.env` file is ignored by Git; use `.env.example` as the committed template.

The local Compose frontend is available at `http://localhost:3001`. The backend is bound to `127.0.0.1:8000` for the host reverse proxy and is not published publicly.

## Production deployment

The production frontend calls `https://deployment-test-api.deepsense.dev` using `NEXT_PUBLIC_API_URL`. Install the Nginx files from `deploy/nginx/` into `/etc/nginx/sites-available/`, create symlinks in `/etc/nginx/sites-enabled/`, and provision certificates for both domains with Certbot before reloading Nginx.

```bash
sudo nginx -t
sudo systemctl reload nginx
docker compose up -d --build
```

The Nginx host proxies the frontend to `127.0.0.1:3001` and the API to `127.0.0.1:8000`. PostgreSQL and pgAdmin remain available only on the Docker network.

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
