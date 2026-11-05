# Frontend

React frontend setup for Aftab Academy.

Styling uses Tailwind CSS v4 through its Vite plugin.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` to configure the backend URL.

## Source layers

- `src/app`: router, Redux store, and shared Axios instance
- `src/pages`: route-level pages
- `src/features`: feature-specific modules
- `src/shared`: reusable components and utilities
