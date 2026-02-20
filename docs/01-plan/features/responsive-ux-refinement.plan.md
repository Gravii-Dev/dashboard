# Plan: Responsive UX Refinement

## 1. Overview
- **Feature Name**: Responsive UX & Scroll Interaction
- **Objective**: Fix mobile layout issues, implement show/hide header on scroll, and clean up scrollbar UI.

## 2. Scope
### 2.1 Dynamic Mobile Header
- Create a mobile-specific header that contains the logo and a hamburger menu trigger.
- Implement "Show on Scroll Up / Hide on Scroll Down" logic.

### 2.2 Sidebar Drawer (Mobile)
- Convert the fixed sidebar into a toggleable drawer for screens < 1024px.
- Ensure the drawer has a backdrop overlay.

### 2.3 Scroll Optimization
- Style: Hide scrollbars globally while keeping overflow functionality.
- Interaction: Clicking "Gravii" logo scrolls to the top of the viewport.

### 2.4 Layout Adjustments
- Adjust main content padding to account for the new dynamic header.
- Ensure content boxes fit within the viewport without breaking the layout.

## 3. Implementation Steps
1. Create `useScrollDirection` hook for show/hide logic.
2. Refactor `Sidebar` to handle "open/closed" states on mobile.
3. Create a `MobileHeader` component.
4. Update `globals.css` for scrollbar hiding and mobile layout tweaks.
5. Integrate "Scroll to top" logic in the logo.

## 4. Success Criteria
- [ ] Header disappears on scroll down, reappears on scroll up.
- [ ] No visible scrollbar, but page is scrollable.
- [ ] Clicking logo triggers smooth scroll to top.
- [ ] Sidebar doesn't block the screen on mobile by default.
