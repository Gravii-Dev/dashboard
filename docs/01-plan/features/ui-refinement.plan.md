# Plan: UI Refinement & Dynamic Charts

## 1. Overview
- **Feature Name**: UI Refinement & Dynamic Charts
- **Objective**: Improve maintainability, extensibility, and accessibility of the dashboard UI.
- **Priority**: High (Structural debt reduction)

## 2. Scope
### 2.1 Dynamic Chart Logic
- Refactor `DonutCard.tsx` to automatically calculate `stroke-dasharray` and `stroke-dashoffset` based on percentage values.
- Remove hardcoded SVG values from `page.tsx`.

### 2.2 CSS Modularization
- Split the 600+ line `globals.css` into component-specific CSS Modules (`*.module.css`).
- Target components: `Sidebar`, `Card`, `DonutCard`, `BarSection`, `KpiCard`.

### 2.3 Accessibility & Icons
- Replace text-based icons in `Sidebar.tsx` with proper accessible SVG icons (or `lucide-react`).
- Add `aria-label` to interactive elements.

## 3. Success Criteria
- [ ] `DonutCard` renders correctly with any valid percentage data without manual SVG tweaking.
- [ ] `globals.css` size reduced significantly, with styles encapsulated in modules.
- [ ] Accessibility audit (basic) passes for sidebar navigation.
- [ ] Zero visual regressions on the existing dashboard pages.

## 4. Schedule
- **Research & Strategy**: Done (Phase 8 Review)
- **Design**: Define CSS Module structure and Chart calculation logic.
- **Implementation (Do)**: Incremental refactoring.
- **Verification (Check)**: Visual diff and gap analysis.
