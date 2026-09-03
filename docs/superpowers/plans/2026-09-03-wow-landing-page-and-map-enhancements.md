# WOW Landing Page and Map Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement scroll-triggered geographic vector art animation on the landing page hero section and enhance map interactions with hover highlighting and smoother transitions to create a WOW first impression inspired by gsap.com and Awwwards-level motion design.

**Architecture:** 
- Add ScrollTriggerAnimatedSVG component that loads a pre-simplified SVG of Tana road network contours and uses GSAP ScrollTrigger to animate paths on scroll
- Create EnhancedCityMap wrapper that adds hover-sensitive highlighting of road segments and smoother map transitions
- Both enhancements integrate with existing GSAP and MapLibre GL instances, respecting performance constraints and user preferences

**Tech Stack:** 
- React 18, Next.js 13+
- GSAP (already used in hero)
- MapLibre GL (used via CityMap)
- TypeScript
- SVG for vector art

## Global Constraints
- Do not add complex 3D effects or WebGL (would increase bundle size unnecessarily)
- Do not change the core layout or information hierarchy of the landing page
- Do not rely on external libraries beyond GSAP (already used) and mapbox-gl (already used via CityMap)
- Do not add animation that distracts from the primary goal: understanding Predicta and navigating to the map
- Reuse existing GSAP integration
- Keep bundle impact low (~5-10KB for SVG)
- Respect prefers-reduced-motion media query
- Maintain fast load times and good performance

---

### Task 1: Create pre-simplified SVG asset of Tana road network contours

**Files:**
- Create: `public/svg/tana-contours.svg`

**Interfaces:**
- Consumes: None (static asset)
- Produces: SVG file for use by ScrollTriggerAnimatedSVG component

- [ ] **Step 1: Extract road network data from existing map style**
  - Inspect CityMap's traffic vector source to understand available layers
  - Identify the 'speeds' source-layer that contains road network data
  - Note: This is exploratory; actual SVG creation may require external tools

- [ ] **Step 2: Simplify and export SVG contours**
  - Use Mapshaper or similar tool to simplify road network data from vector tiles
  - Focus on major roads and contours that are recognizable as Tana's layout
  - Reduce complexity to ~5-10KB file size while retaining geographic recognizability
  - Style with single stroke color (will be overridden via CSS/theme variables)
  - Export as `public/svg/tana-contours.svg`

- [ ] **Step 3: Verify SVG loads correctly**
  - Test direct URL: `http://localhost:3000/svg/tana-contours.svg`
  - Ensure SVG renders properly and is not corrupted
  - Check file size is reasonable (< 15KB)

- [ ] **Step 4: Commit**
```bash
git add public/svg/tana-contours.svg
git commit -m "assets: add simplified Tana road network SVG for hero animation"
```

### Task 2: Create ScrollTriggerAnimatedSVG component

**Files:**
- Create: `components/landing/scroll-trigger-animated-svg.tsx`
- Modify: `components/landing/hero.tsx` (to import and use the new component)

**Interfaces:**
- Consumes: SVG asset from public/svg/tana-contours.svg
- Produces: Animated SVG overlay that responds to scroll progress
- Consumes from HeroSection: None
- Produces for HeroSection: Visual enhancement layer

- [ ] **Step 1: Create basic component structure**
  - Create functional component with TypeScript props interface
  - Add imports: React, useEffect, useRef, gsap, ScrollTrigger
  - Initialize GSAP context and ScrollTrigger on mount

- [ ] **Step 2: Implement SVG loading and rendering**
  - Load SVG from public/svg/tana-contours.svg (or consider inline if small)
  - Render SVG in absolutely positioned div (pointer-events-none)
  - Set initial SVG path styles (stroke-dasharray, stroke-dashoffset for drawing effect)
  - Add aria-hidden="true" for accessibility

- [ ] **Step 3: Implement ScrollTrigger animation**
  - Create GSAP ScrollTrigger instance on mount:
    * Trigger: hero section (passed via prop or found via ref)
    * Start: "top top"
    * End: "bottom top" 
    * Scrub: true (or slight smoothing)
    * OnUpdate: update GSAP animation progress
  - Animate SVG paths using stroke-dashoffset from full length to 0 (drawing effect)
  - Alternative: stagger reveal using opacity or scale

- [ ] **Step 4: Add prefers-reduced-motion support**
  - Check window.matchMedia("(prefers-reduced-motion: reduce)").matches
  - If true, skip ScrollTrigger initialization (render static SVG or none)
  - Provide smooth fallback for reduced motion users

- [ ] **Step 5: Add error handling**
  - Wrap SVG load in try/catch
  - On error, log warning and render nothing (graceful fallback)
  - Ensure hero section remains functional if SVG fails to load

- [ ] **Step 6: Add cleanup**
  - Return cleanup function from useEffect to revert GSAP context
  - Remove ScrollTrigger instance and event listeners on unmount

- [ ] **Step 7: Import and use in HeroSection**
  - Import ScrollTriggerAnimatedSVG in hero.tsx
  - Add component as sibling to map and text block, absolutely positioned
  - Ensure proper z-indexing (above map, below text block)

- [ ] **Step 8: Test basic functionality**
  - Verify component mounts without errors
  - Check SVG renders in correct position
  - Test scroll triggers animation

- [ ] **Step 9: Commit**
```bash
git add components/landing/scroll-trigger-animated-svg.tsx components/landing/hero.tsx
git commit -m "feat: add ScrollTriggerAnimatedSVG for hero section scroll animation"
```

### Task 3: Create EnhancedCityMap component with hover highlighting

**Files:**
- Create: `components/map/enhanced-city-map.tsx`
- Modify: `components/landing/hero.tsx` (to use EnhancedCityMap instead of CityMap)

**Interfaces:**
- Consumes: All CityMap props (pass-through)
- Consumes: MapLibre GL instance from CityMap
- Produces: Enhanced map with hover highlighting and smoother transitions
- Consumes from HeroSection: None
- Produces for HeroSection: Enhanced map interactions

- [ ] **Step 1: Create basic wrapper component**
  - Create functional component that accepts all CityMap props
  - Import CityMap and re-export its props interface
  - Render CityMap with all props passed through
  - Add TypeScript for props

- [ ] **Step 2: Implement hover highlighting**
  - Add useRef for map instance (get from CityMap via ref or useMap hook)
  - Add useEffect to set up hover listeners when map is available
  - Use requestAnimationFrame debounce for mousemove handler:
    * On mousemove: use map.queryRenderedFeatures to get features at point
    * Filter for road network layer (likely from 'traffic' source, 'speeds' source-layer)
    * If feature found: use map.setFeatureState to set hover: true on feature ID
    * Define map layer style that checks [hover] property and applies highlight
  - On mouseleave or no feature: clear feature state (hover: false)
  - Clean up event listeners on unmount

- [ ] **Step 3: Implement smoother transitions**
  - On map load, configure easing for smoother zooming/panning
  * Option A: map.setDefaultEasing('cubic-bezier(0.25, 0.46, 0.45, 0.94))' 
  * Option B: Adjust fadeDuration or animation duration via map options
  - Experiment with values to get pleasant, responsive feel

- [ ] **Step 4: Add optional tooltip (low priority)**
  - If time permits, add small HTML tooltip near cursor
  - Show congestion level from feature properties (if available)
  - Position tooltip absolutely, update on mousemove
  - Hide when no feature under cursor

- [ ] **Step 5: Add error handling**
  - Wrap CityMap in error boundary
  - On error, display fallback message ("Map temporarily unavailable")
  - Ensure layout doesn't break

- [ ] **Step 6: Add cleanup**
  - Remove all event listeners and clean up feature states on unmount
  - Prevent memory leaks

- [ ] **Step 7: Import and use in HeroSection**
  - Import EnhancedCityMap in hero.tsx
  - Replace CityMap import and usage with EnhancedCityMap
  - Pass through all existing props

- [ ] **Step 8: Test hover functionality**
  - Verify map still loads and interacts normally
  - Test hover highlighting on road segments
  - Check for smooth appearance/disappearance of highlights
  - Verify no performance lag during rapid mouse movement

- [ ] **Step 9: Commit**
```bash
git add components/map/enhanced-city-map.tsx components/landing/hero.tsx
git commit -m "feat: add EnhancedCityMap with hover highlighting and smoother transitions"
```

### Task 4: Integrate and polish both enhancements

**Files:**
- Modify: `components/landing/hero.tsx` (final adjustments)
- Modify: `public/svg/tana-contours.svg` (if adjustments needed)
- Create: `styles/hero-animation.css` (optional, for CSS variables)

**Interfaces:**
- Consumes: Both new components
- Produces: Cohesive WOW landing page experience
- Produces: Final integrated feature ready for testing

- [ ] **Step 1: Adjust SVG styling and positioning**
  - Ensure ScrollTriggerAnimatedSVG is properly positioned:
    * absolute inset-0 over map but under text block
    * pointer-events-none so it doesn't interfere with map interactions
  - Test SVG stroke color matches theme (consider using CSS variables)
  - Adjust SVG complexity if animation is too heavy or too subtle

- [ ] **Step 2: Fine-tune ScrollTrigger animation**
  - Experiment with different SVG animation effects:
    * Path drawing (stroke-dashoffset)
    * Stagger reveal (opacity/stagger on paths)
    * Subtle continuous motion (transform on paths)
  - Adjust ScrollTrigger start/end points for optimal timing
  - Consider adding slight smoothing or easing to scroll progression
  - Test with prefers-reduced-motion enabled/disabled

- [ ] **Step 3: Fine-tune map hover highlighting**
  - Adjust hover highlight style (color, width, opacity)
  - Ensure highlight is visible but not distracting
  - Test hover performance at different zoom levels
  - Verify tooltip (if implemented) doesn't interfere with map usability

- [ ] **Step 4: Test performance**
  - Run Lighthouse to check for performance impact
  - Verify no major increase in script duration
  - Check for layout shifts (should be minimal as SVG is absolutely positioned)
  - Test on mobile devices to ensure touch interactions still work

- [ ] **Step 5: Test accessibility**
  - Verify SVG is decorative (aria-hidden="true")
  - Ensure map hover highlight also provides context via optional tooltip
  - Confirm animations respect system motion preferences
  - Test with screen reader to ensure no interference

- [ ] **Step 6: Final verification against goals**
  - Landing page feels dynamic and alive on scroll
  - Vector art (Tana contours) provides geographic context
  - Scroll-triggered animation feels inspired by gsap.com
  - Map interactions are enhanced with hover highlighting and smooth transitions
  - Core message and CTA remain prominent
  - Performance is maintained

- [ ] **Step 7: Commit**
```bash
git add components/landing/hero.tsx public/svg/tana-contours.svg
git commit -m "feat: integrate and polish WOW landing page and map enhancements"
```