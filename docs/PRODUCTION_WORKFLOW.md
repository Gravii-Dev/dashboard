# Production Readiness Workflow

Workflow to take the Gravii Dashboard from current state (static/mock data) to a production-ready product. Order is a suggestion; adjust by priority and team capacity.

---

## Phase 1: Foundation

### 1.1 Backend & Data Contract
- [ ] Define API contract (REST or tRPC): endpoints for TVL/TIV, risk, labels, campaigns, analytics.
- [ ] Implement or integrate backend services (database, aggregations, risk engine).
- [ ] Add API client in the app (`src/lib/api.ts` or tRPC router) and env for API base URL.

### 1.2 Environment & Config
- [ ] Use env vars for all config: `NEXT_PUBLIC_*` for client, server-only for secrets.
- [ ] Add `.env.example` and document required variables.
- [ ] Separate configs for local / staging / production (e.g. different API URLs).

### 1.3 Authentication & Authorization
- [ ] Choose auth provider (Clerk, NextAuth, Supabase Auth, etc.).
- [ ] Protect dashboard routes (middleware or layout guard).
- [ ] Add login/logout and optional role-based access (e.g. admin vs viewer).
- [ ] Pass auth token to API client (cookie or header).

---

## Phase 2: Data & UX

### 2.1 Replace Mock Data with Real Data
- [ ] Wire Overview (TVL/TIV, chains, KPIs) to API.
- [ ] Wire Risk page (flagged wallets, clusters, filters) to API.
- [ ] Wire Labels/Segments and filters to API.
- [ ] Wire Analytics (group metrics, chain tabs) to API.
- [ ] Wire Campaigns (list, create, update) to API.

### 2.2 Loading & Error States
- [ ] Add loading skeletons or spinners for each main section.
- [ ] Use React Error Boundaries for page/section-level errors.
- [ ] Add retry and clear error messages for failed requests.
- [ ] Consider TanStack Query (or SWR) for caching, loading, and error handling.

### 2.3 Empty & Edge States
- [ ] Define behavior when no data (empty tables, no campaigns, no segments).
- [ ] Handle long lists (pagination or virtual scroll) where needed.
- [ ] Validate forms (e.g. campaign create) and show inline errors.

---

## Phase 3: Quality & Security

### 3.1 Testing
- [ ] Unit tests for critical utils and hooks (e.g. filter logic, formatters).
- [ ] Component tests for shared UI (Card, KpiCard, filters, tables).
- [ ] E2E tests for main flows: login → overview, risk filters, campaign create (optional but recommended).

### 3.2 Security
- [ ] Ensure no secrets in client bundle; use server-only env and API routes if needed.
- [ ] Apply security headers (CSP, HSTS, etc.) via Next.js config or platform.
- [ ] Validate and sanitize all user input (forms, query params).
- [ ] Rate limiting and abuse protection on sensitive endpoints (backend).

### 3.3 Accessibility & SEO
- [ ] Keyboard navigation and focus management for modals, tabs, filters.
- [ ] ARIA labels and roles where needed; fix any a11y issues (e.g. select, custom controls).
- [ ] Meta tags and basic SEO if any public or shareable pages exist.

---

## Phase 4: Reliability & Observability

### 4.1 Error Monitoring
- [ ] Integrate error tracking (e.g. Sentry) for client and optionally server.
- [ ] Log API failures and surface critical errors to the team.

### 4.2 Logging & Analytics
- [ ] Structured logging for important actions (e.g. campaign launch, risk filter usage).
- [ ] Product analytics (e.g. page views, feature usage) if required; respect privacy.

### 4.3 Performance
- [ ] Measure Core Web Vitals; fix regressions (lazy load heavy charts, optimize images if any).
- [ ] Review bundle size and code-split large routes or components if needed.

---

## Phase 5: Deployment & Operations

### 5.1 CI/CD
- [ ] Run lint and typecheck on every PR.
- [ ] Run tests (unit + optional E2E) in CI.
- [ ] Build and deploy to staging on merge to main/develop; promote to production via tag or manual step.

### 5.2 Hosting & Infra
- [ ] Deploy to chosen platform (Vercel, AWS, etc.) with staging and production environments.
- [ ] Configure custom domain and SSL.
- [ ] Document rollback and deployment process.

### 5.3 Documentation
- [ ] Update README with setup, env vars, and how to run tests/build.
- [ ] Document API usage and any deployment/ops runbooks for the team.

---

## Quick Reference

| Focus           | Key deliverables                                      |
|----------------|--------------------------------------------------------|
| **Data**       | API contract, backend, API client, replace mock data   |
| **Auth**       | Login, route protection, token to API                  |
| **UX**         | Loading, errors, empty states, validation              |
| **Quality**    | Tests, security review, a11y                           |
| **Ops**        | Env config, error monitoring, CI/CD, deploy docs       |

Start with **Phase 1** (backend contract + env + auth), then **Phase 2** (real data + loading/errors). Phases 3–5 can run in parallel once the core flow works.
