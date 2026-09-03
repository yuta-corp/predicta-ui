# WOW Landing Page and Map Enhancements Design

## Overview
Enhance the Predicta landing page with subtle background motion and scroll-triggered geographic vector art inspired by gsap.com, while improving map interactions with hover highlighting and smoother transitions. The goal is to create a "WOW" first impression that feels alive and responsive, aligning with Awwwards-level motion design while maintaining clarity and performance.

## Goals
- Create a landing page that feels dynamic and alive on scroll
- Use vector art (simplified Tana road network contours) as an animated background layer
- Implement scroll-triggered animations using GSAP ScrollTrigger (consistent with existing hero animations)
- Enhance map interactions: hover-sensitive highlighting of road segments, smoother zooming/panning
- Respect user motion preferences (prefers-reduced-motion)
- Maintain fast load times and good performance
- Keep the core message and call-to-action prominent

## Non-Goals
- Do not add complex 3D effects or WebGL (would increase bundle size unnecessarily)
- Do not change the core layout or information hierarchy of the landing page
- Do not rely on external libraries beyond GSAP (already used) and mapbox-gl (already used via CityMap)
- Do not add animation that distracts from the primary goal: understanding Predicta and navigating to the map

## Approach

### Overall Strategy
1. **Hero Enhancement**: Keep existing GSAP entrance choreography (wordmark, title, subtitle, CTA, veil dissolve). Add an SVG overlay layer containing simplified geographic vector art (Tana road network contours) positioned between the map and the text block. Use GSAP ScrollTrigger to animate the SVG paths based on scroll progress (e.g., path drawing, subtle stagger).
2. **Map Enhancement**: Wrap the existing CityMap component to add:
   - Hover-sensitive highlighting: when cursor is over a road segment, highlight it with a subtle glow and/or color change
   - Optional tooltip showing congestion level (low/medium/high) from segment properties
   - Smooth transitions: configure map.ease() for smoother zooming and panning
3. **Performance & Fallbacks**:
   - SVG loaded as a React component or inline to avoid extra network request
   - SVG animations only active when hero section is in viewport (via ScrollTrigger)
   - Map hover updates debounced using requestAnimationFrame to prevent overload
   - All animations respect prefers-reduced-motion media query (disabled when enabled)
   - Graceful fallbacks for SVG load failures or map initialization errors

### Why This Approach
- Reuses existing GSAP integration, minimizing new dependencies
- SVG is lightweight (~5-10KB for simplified contours) and scales well
- ScrollTrigger provides precise control over scroll-linked animations, matching gsap.com aesthetic
- Map enhancements build on existing MapLibre GL instance, avoiding re-initialization
- Approach is incremental: each enhancement can be toggled independently if needed

## Components

### HeroSection (unchanged except for added layer)
- Located in `/components/landing/hero.tsx`
- Keeps all existing GSAP entrance choreography
- Adds `<ScrollTriggerAnimatedSVG />` component as a sibling to the map and text block, absolutely positioned

### ScrollTriggerAnimatedSVG
- New component to be created in `/components/landing/scroll-trigger-animated-svg.tsx`
- Responsibilities:
  - Load pre-simplified SVG of Tana road network contours (as static asset or inline string)
  - Render SVG inside a wrapper div (pointer-events-none, absolute positioned over map but under text block)
  - Initialize GSAP ScrollTrigger on mount:
    * Trigger: hero section
    * Start: "top top"
    * End: "bottom top" (or adjustable)
    * Scrub: true (or slight smoothing)
    * OnUpdate: update GSAP animation progress that controls SVG path properties (stroke-dashoffset, stroke-dasharray for drawing effect; or transform for subtle motion)
  - Optional: add subtle pulsing or flowing motion via GSAP timeline on completed paths
  - Clean up GSAP context on unmount
  - Respect prefers-reduced-motion: if media query matches, skip ScrollTrigger initialization (render static SVG or none)
  - Error handling: if SVG fails to load, render nothing and log warning

### EnhancedCityMap
- New wrapper component to be created in `/components/map/enhanced-city-map.tsx` (or adjust existing CityMap if preferred)
- Responsibilities:
  - Render the existing CityMap component (preserving all its props)
  - Add hover interaction:
    * Use mapbox-gl's `on('mousemove', ...)` debounced with requestAnimationFrame
    * On mousemove: queryRenderedFeatures at point, filter for road layer (e.g., 'road-network' or similar)
    * If a feature is found, set its feature state via `map.setFeatureState({ source: 'vector-layer', id: feature.id, state: { hover: true } })`
    * Define a map layer style that checks for `[hover]` and applies highlight (e.g., increase brightness, add glow)
    * On mouseleave or when no feature, clear feature state
  - Optional tooltip: render a small HTML tooltip near cursor showing congestion level from feature properties
  - Smooth transitions: on component initialization, if map instance available, call `map.setDefaultEasing(...)` or adjust animation duration via `map.ease()`
  - Clean up event listeners on unmount
  - Error handling: wrap CityMap in error boundary; on error, display fallback UI

## Data Flow

### Initial Load
1. HeroSection mounts:
   - Existing GSAP entrance choreography runs (wordmark, title, subtitle, CTA, veil dissolve)
   - ScrollTriggerAnimatedSVG mounts and loads SVG asset
   - EnhancedCityMap mounts and initializes MapLibre GL with smoother easing config
2. Map renders base tile layer and road network layers from vector source
3. SVG renders as invisible paths (stroke-dashoffset set to full length) ready for animation

### On Scroll (through hero section)
1. ScrollTrigger tracks scroll progress relative to hero section
2. Progress value (0 to 1) passed to GSAP animation (e.g., a timeline controlling SVG path stroke properties)
3. SVG paths animate: 
   - Option A (Path Drawing): stroke-dashoffset goes from path length to 0, making paths draw themselves
   - Option B (Stagger Reveal): each path staggered in opacity or scale
   - Option C (Flowing Motion): subtle continuous motion on paths tied to scroll progress
4. Map remains interactive; easing provides smoother feel but no direct scroll linkage

### On Hover (Map)
1. User moves cursor over map
2. EnhancedCityMap's debounced mousemove handler fires (max once per animation frame)
3. queryRenderedFeatures retrieves features under pointer; filtered to road network layer
4. If feature found:
   - Set feature state hover: true for that feature ID
   - Map's style detects hover state and applies highlight (predefined in style or via setPaintProperty)
   - Optional: update tooltip position and content with feature's congestion level
5. If no feature or on mouseleave: clear feature state (hover: false)
6. Highlight appears/disappears smoothly due to map's render cycle

### Performance Considerations
- SVG animation only runs when hero is in viewport (ScrollTrigger efficiency)
- Map hover uses requestAnimationFrame debounce to limit calls to ~60fps max
- prefers-reduced-motion media query disables SVG animations but keeps essential map interactions
- All animations use GSAP's lag smoothing for consistent performance
- SVG loaded once; no additional network requests after initial load

## Error Handling & Testing

### Error Handling
- **SVG Load Failure**: If SVG asset fails to load (network error, 404), ScrollTriggerAnimatedSVG gracefully falls back to rendering nothing (no visual break) and logs warning to console. Hero section remains fully functional.
- **Map Initialization Failure**: EnhancedCityMap wraps CityMap in error boundary; if MapLibre GL fails to initialize, displays a subtle fallback message ("Map temporarily unavailable") without breaking layout.
- **GSAP Animation Errors**: ScrollTrigger callbacks wrapped in try/catch; if animation fails (unlikely), silently deactivates to avoid JS errors blocking UI.
- **Hover Performance**: Map hover uses requestAnimationFrame debounce; if rapid movements cause lag, falls back to simpler highlight on mousemove end.
- **Map Style Errors**: If setting feature state fails (e.g., layer not found), log warning and disable hover highlighting for that session.

### Testing Approach
- **Visual Regression**: Use Storybook to test ScrollTriggerAnimatedSVG at different scroll progress values (0%, 25%, 50%, 75%, 100%) ensuring SVG paths animate correctly. Test EnhancedCityMap hover states.
- **Unit Tests**: 
  - ScrollTriggerAnimatedSVG: mock GSAP/ScrollTrigger, verify animation progresses with scroll position
  - EnhancedCityMap: mock mapbox-gl, verify feature state changes on hover and that event listeners are registered/removed
- **Manual QA Checklist**:
  1. Hero loads with existing entrance choreography intact
  2. On scroll, SVG paths animate smoothly (drawing/stagger/flow effect)
  3. SVG animation respects prefers-reduced-motion (disabled when enabled)
  4. Map hover highlights road segments smoothly without lag
  5. Map zoom/pan feels smoother than before (eased)
  6. Optional tooltip appears on hover with relevant info
  7. No console errors in normal or error conditions
  8. Mobile layout unaffected (SVG absolutely positioned, doesn't break flow)
  9. Performance: check Lighthouse for no major script duration increase; ensure no layout shift from SVG load
- **Accessibility Testing**:
  - SVG decorative (aria-hidden="true"), doesn't interfere with screen readers
  - Map hover highlight also provides optional tooltip for additional context (not sole conveyance of info)
  - All interactive elements (CTA link) maintain existing accessibility
  - Animations respect system motion preferences

## Implementation Notes
- Pre-simplify Tana road network SVG from map data source (same as used for CityMap) using a tool like Mapshaper or svgo to reduce complexity while retaining recognizability.
- Store SVG as a static asset in `/public/svg/tana-contours.svg` or inline as a string in the component if small enough.
- Determine map layer names for road network by inspecting CityMap's source style; likely need to add a new layer for hover effect or use existing layer.
- Consider using CSS variables for SVG stroke colors to match theme (foreground/primary etc.).
- Ensure ScrollTrigger animation is GSAP 3 compatible (already using gsap import).
- Add types for new components using TypeScript.

## Future Considerations
- If performance allows, add animated traffic flow lines that pulse based on live congestion data (would require updating SVG or adding separate canvas/WebGL layer).
- Experiment with different SVG animation effects (e.g., morphing, particle systems) as enhancements.
- A/B test different levels of animation subtlety to find optimal balance between delight and clarity.