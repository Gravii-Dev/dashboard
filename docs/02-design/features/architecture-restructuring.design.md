# Design: Architecture Restructuring

## 1. Directory Structure Design
All components in `src/components/dashboard/` will be organized into folders:
```text
src/components/dashboard/
├── BarSection/ (New)
├── Card/ (Move existing)
├── ChainBadge/ (New)
├── ClusterCard/ (New)
├── DonutCard/ (Move existing)
├── InfoTooltip/ (New)
├── KpiCard/ (Move existing)
├── PageHeader/ (New)
├── RiskBadge/ (New)
├── SegTabs/ (New)
└── Sidebar/ (Move existing)
```

## 2. CSS Module Separation
Styles will be extracted from `src/app/globals.css` and moved to their respective `.module.css` files.

## 3. Re-exporting Strategy (index.ts)
Each folder will have an `index.ts` to simplify imports:
```typescript
// src/components/dashboard/Card/index.ts
export * from "./Card";
```

## 4. Layout & Grid CSS Strategy
Styles related to grid layouts (`.grid-4`, `.grid-2-half`, `.quad-grid`, `.triple-grid`, `.main`) and page-level states (`.page.active`, `.chain-tabs`, `.group-bar`) will remain in `globals.css` for now, as they are used across multiple components and pages.

## 5. Implementation Roadmap
1. Create folders and move existing `Card`, `DonutCard`, `KpiCard`, `Sidebar`.
2. Extract CSS and create new folders for `PageHeader`, `BarSection`, `ChainBadge`, `RiskBadge`.
3. Extract CSS and create folders for `InfoTooltip`, `SegTabs`, `ClusterCard`.
4. Update all `page.tsx` files to match the new structure.
5. Create `index.ts` files.
6. Clean up `globals.css`.
