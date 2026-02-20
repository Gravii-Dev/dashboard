# Plan: Component Folder Restructuring & CSS Isolation

## 1. Overview
- **Feature Name**: Architecture Restructuring
- **Objective**: Move all dashboard components into individual folders and isolate all remaining CSS.
- **Pattern**: Folder-per-component (e.g., `src/components/dashboard/Card/Card.tsx`)

## 2. Target Components
- **Existing Modules**: `Card`, `Sidebar`, `DonutCard`, `KpiCard` (Move files to folders)
- **New Modules (Extract from globals.css)**:
  - `BarSection`
  - `ChainBadge`
  - `RiskBadge`
  - `PageHeader`
  - `SegTabs`
  - `ClusterCard`
  - `InfoTooltip`
  - `Risk` (Risk-specific layout/table styles)
  - `Analytics` (Analytics-specific pills/tabs styles)
  - `Campaign` (Campaign-specific form/card styles)

## 3. Implementation Steps
1. Create directories for all components.
2. Move `.tsx` and `.module.css` files.
3. Create new `.module.css` for the remaining components.
4. Update imports across the entire project.
5. Create `index.ts` for each folder to simplify imports.
6. Clean up `globals.css` to its bare minimum.

## 4. Success Criteria
- [ ] No broken imports or compilation errors.
- [ ] Zero visual regressions.
- [ ] `globals.css` contains only variables, resets, and layout grids.
- [ ] All components in `src/components/dashboard/` follow the folder-per-component pattern.
