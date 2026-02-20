# Design: UI Refinement & Dynamic Charts

## 1. DonutCard Logic Design
### 1.1 New Segment Interface
```typescript
export type DonutSegmentData = {
  label: string;
  value: number; // Percentage (0-100)
  color: string;
};
```

### 1.2 Calculation Algorithm
- **Radius (r)**: 48
- **Circumference (C)**: 2 * Math.PI * 48 (≈ 301.59)
- **Calculation Loop**:
  - `cumulativeValue = 0`
  - For each segment:
    - `strokeDasharray = (segment.value / 100) * C + " " + C`
    - `strokeDashoffset = -(cumulativeValue / 100) * C`
    - `cumulativeValue += segment.value`

## 2. CSS Module Mapping
| Global Class | New Module |
|--------------|------------|
| `.card`, `.card-title` | `Card.module.css` |
| `.sidebar`, `.nav-item` | `Sidebar.module.css` |
| `.donut-*`, `.legend-*` | `DonutCard.module.css` |
| `.kpi-*` | `KpiCard.module.css` |

## 3. Sidebar Icon Refactoring
- Replace `⊞`, `◎`, `◈`, `⚠` with SVG path data constants.
- Wrap icons in an `Icon` component that accepts `size` and `color`.

## 4. Implementation Plan (Order)
1. **Module Creation**: Create `*.module.css` files and move styles.
2. **Card Refactor**: Update `Card.tsx` and `DonutCard.tsx` to use CSS Modules.
3. **Logic Update**: Implement calculation logic in `DonutCard.tsx`.
4. **Integration**: Update `page.tsx` with simplified data format.
