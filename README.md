## Error Boundaries in Next.js (ALX GraphQL 0x03)

This project shows how to add a robust Error Boundary to a Next.js app, provide a friendly fallback UI, and optionally wire up production monitoring with Sentry.

## Why this matters

- Prevents full‑app crashes from isolated component failures
- Replaces blank screens with helpful messages and a recovery action
- Captures context for debugging locally and in production (via Sentry)

## Features

- Class‑based ErrorBoundary component with TypeScript types
- Fallback UI with a “Try again” button to reset boundary state
- Easy integration point for Sentry error reporting
- Demo pattern for testing error handling with an intentionally failing component

## Tech stack

- Next.js 15, React 19, TypeScript 5
- Apollo Client 4, GraphQL 16
- Tailwind CSS 4 (styling), ESLint 9

## Project structure

This folder hosts the documentation and the app lives in a subfolder.

- `alx-graphql-0x03/`
	- `README.md` (this file)
	- `alx-rick-and-morty-app/` (Next.js app)
		- `pages/`, `components/`, `graphql/`, `public/`, `styles/`
		- `package.json` (scripts: dev, build, start, lint)
		- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`

## Prerequisites

- Node.js 18.18+ (20 LTS recommended)
- npm (uses `package-lock.json`) 
- Optional: Sentry account and DSN for monitoring

## Quick start (Windows PowerShell)

From the repo root:

```powershell
cd "alx-graphql-0x03/alx-rick-and-morty-app"
npm install
npm run dev
```

Then open http://localhost:3000.

## Available scripts

- `npm run dev` – Start the Next.js dev server
- `npm run build` – Build for production
- `npm run start` – Start the production server (after build)
- `npm run lint` – Run ESLint

## Error Boundary: how it works

React Error Boundaries are special class components that catch JavaScript errors in their child tree during rendering, in lifecycle methods, and in constructors. They do not catch:

- Errors in event handlers (attach your own `try/catch` there)
- Asynchronous errors outside React render
- Server-side pre-render errors (SSR) before hydration

### Typical placement

- Create `components/ErrorBoundary.tsx` in the Next.js app
- Wrap the app tree in `pages/_app.tsx` so all pages are covered

Example shape (simplified):

```tsx
// components/ErrorBoundary.tsx
import React from 'react';

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		// Optional: forward to monitoring (e.g., Sentry)
		// Sentry.captureException(error, { extra: info });
		console.error('ErrorBoundary caught:', error, info);
	}

	reset = () => this.setState({ hasError: false, error: undefined });

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: 16 }}>
					<h2>Something went wrong.</h2>
					<button onClick={this.reset}>Try again</button>
				</div>
			);
		}
		return this.props.children;
	}
}
```

Wrap your app in `pages/_app.tsx`:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ErrorBoundary>
			<Component {...pageProps} />
		</ErrorBoundary>
	);
}
```

### Testing the boundary quickly

Add a throw‑on‑render demo component, render it on a test page, and verify the fallback UI appears. Remove after verification.

```tsx
// components/Boom.tsx
export default function Boom() {
	throw new Error('Boom!');
}
```

## Optional: Sentry integration

Sentry helps you capture errors with stack traces and user context in production.

1) Install and initialize

```powershell
cd "alx-graphql-0x03/alx-rick-and-morty-app"
npm install @sentry/nextjs
npx sentry-wizard@latest -i nextjs
```

This sets up `sentry.client.config.ts` and `sentry.server.config.ts`. Follow prompts.

2) Provide environment variables

Create `.env.local` (don’t commit secrets):

```env
SENTRY_DSN=your-dsn-here
SENTRY_ENVIRONMENT=development
SENTRY_RELEASE=local
```

3) Capture errors (already covered by ErrorBoundary’s `componentDidCatch`). You can also call `Sentry.captureException(err)` anywhere needed.

Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/

## Notes and limitations

- Error Boundaries don’t catch event handler errors; use `try/catch` in the handler
- Server‑side render (SSR) errors won’t be caught by client error boundaries
- For App Router projects, prefer route‑level error boundaries (e.g., `error.tsx` per route)

## Troubleshooting

- “Boundary doesn’t render fallback”
	- Ensure it’s a class component with `getDerivedStateFromError` and `componentDidCatch`
	- Verify the boundary actually wraps the failing component
	- Check that the error is thrown during render/commit, not only in an event handler

- “Sentry isn’t receiving events”
	- Confirm `SENTRY_DSN` is set and not empty
	- Ensure Sentry init files exist and run on client/server
	- Check ad‑blockers and network errors in the browser console

## Learning objectives (recap)

- Understand how React Error Boundaries work
- Implement a class component in TypeScript for error handling
- Handle runtime errors gracefully in a Next.js application
- Integrate third‑party error monitoring (Sentry)
- Test error handling components effectively

## Real‑world impact

Error boundaries are essential in production apps to:

1. Prevent entire app crashes from single component failures
2. Show meaningful fallback UI instead of blank screens
3. Track and monitor errors in production environments
4. Allow users to recover from non‑critical errors
5. Maintain stability and improve user experience

## Summary of what’s implemented

- ErrorBoundary class with TypeScript interfaces
- App wrapped with the ErrorBoundary in `pages/_app.tsx`
- Test component approach to simulate and verify failures
- Optional Sentry integration points for monitoring
- Fallback UI with a “Try again” recovery action

This follows React and Next.js best practices while demonstrating modern TypeScript patterns.