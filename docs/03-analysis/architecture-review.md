# Architecture Review: Gravii Dashboard
Date: 2026-02-20
Status: Draft

## 1. Overview
The Gravii Dashboard is a Next.js 15 application using the App Router.
- **Framework**: Next.js 15, React 19
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables) with BEM-like naming conventions.
- **State Management**: Primarily local state + URL state (via `usePathname`).
- **Data Fetching**: Currently using mock data (`src/lib/*-data.ts`).

## 2. Directory Structure Analysis
The structure follows the Next.js App Router conventions:
```
src/
├── app/                 # Routes and Layouts
│   ├── (dashboard)/     # Dashboard layout group
│   │   ├── analytics/
│   │   ├── campaigns/
│   │   ├── labels/
│   │   └── risk/
│   └── layout.tsx       # Root layout
├── components/          # Reusable UI components
│   └── dashboard/       # Dashboard-specific components
├── lib/                 # Utilities and mock data
└── hooks/               # Custom React hooks
```
**Verdict**: ✅ Excellent adherence to conventions. Separation of concerns is clear.

## 3. Code Quality Assessment

### Component Structure
- Components are granular (e.g., `DonutCard`, `KpiCard`).
- Props interfaces are used, ensuring some type safety.
- `use client` directives are correctly applied where hooks are needed (`Sidebar.tsx`).

### Styling (CSS)
- **Approach**: Global CSS file (`globals.css`) with CSS variables for theming.
- **Pros**: 
  - No build step for CSS.
  - Native browser support.
  - Dark mode built-in via `--bg-primary` variables.
- **Cons**: 
  - `globals.css` is large (>600 lines) and growing.
  - Potential for class name collisions as the project scales.
  - Hard to maintain media queries scattered at the end of the file.
- **Recommendation**: Consider refactoring into CSS Modules (`*.module.css`) for component-specific styles to ensure encapsulation.

### Data Management
- Data is currently hardcoded in `src/lib`.
- This is appropriate for the mockup/prototype phase (Phase 3).
- **Future Step**: Replace `src/lib/*-data.ts` with API calls (Phase 4 integration).

## 4. Key Findings & Recommendations

### Strengths
- **Performance**: Minimal dependencies (no heavy UI libraries like MUI or AntD).
- **Clean Code**: Readable and well-structured TypeScript.
- **Design System**: Consistent use of CSS variables for colors and spacing.

### Areas for Improvement
1.  **CSS Organization**: Break down `globals.css` into modular styles.
2.  **Accessibility**: 
    - Text-based icons (e.g., "⊞", "◎") may not be accessible. Consider using `lucide-react` or similar.
    - Ensure color contrast ratios meet WCAG standards.
3.  **Hardcoded Values**:
    - "Project name" in Sidebar is static.
    - SVG paths in `DonutCard` seem manual; consider calculating them dynamically based on data.

## 5. Next Steps
- **Refactor CSS**: Move component styles to CSS Modules.
- **Integrate API**: Replace mock data with real data fetching.
- **Enhance A11y**: Add aria-labels and proper icons.
