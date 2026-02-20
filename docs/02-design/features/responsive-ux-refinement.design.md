# Design: Responsive UX Refinement

## 1. Scroll Logic Design
### 1.1 `useHeaderVisible` Hook
- **State**: `isVisible: boolean`, `lastScrollY: number`
- **Effect**: Add scroll event listener.
  - If `currentScrollY > lastScrollY` and `currentScrollY > 50` -> `isVisible = false`
  - If `currentScrollY < lastScrollY` -> `isVisible = true`

## 2. Component Structure
### 2.1 `Sidebar`
- Add `isOpen` state for mobile.
- **CSS**: Use `transform: translateX()` for smooth slide-in.
- **Overlay**: Background dimming when sidebar is open on mobile.

### 2.2 `MobileHeader`
- Only visible on `< 1024px`.
- Contains Hamburger icon and "Gravii" logo.
- **Animation**: `transition: transform 0.3s ease-in-out`.

## 3. Styling Rules
### 3.1 Scrollbar Hiding
- Apply to `body` and all scrollable containers.
- Ensure `overflow-y: scroll` or `auto` is still present to allow scrolling.

### 3.2 Viewport Management
- Use `width: 100%`, `max-width: 100vw`, and `box-sizing: border-box` to prevent horizontal overflow.

## 4. Implementation Plan
1. Create `src/hooks/useHeaderVisible.ts`.
2. Update `src/components/dashboard/Sidebar/Sidebar.tsx` with mobile drawer logic.
3. Update `src/app/(dashboard)/layout.tsx` to include the `MobileHeader`.
4. Update `src/app/globals.css` for scrollbar and layout adjustments.
