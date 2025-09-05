# Product Requirements Document: Ratio Visualizer

## Technical Specifications

- **Framework**: SolidJS
- **Build Tool**: Vite
- **Dependencies**: Only solid-js and vite (dev dependency)
- **No additional libraries** for styling, routing, state management, or testing
- **Development**: `npm run dev` for local development with hot-reloading

## Architecture Principles

- Single-page application with no routing
- Transient state only - no persistence
- Minimize dependencies and code complexity
- No error boundaries or complex error handling

## File Structure

/src

- App.jsx (main component)
- index.jsx (entry point)
- index.css (minimal styling)
  /package.json
  /vite.config.js
  /index.html

## Development Guidelines

- Use reactive signals for state management
- No persistent state - everything resets on page reload
- Flexbox for layouts
- Inline styles or minimal CSS
- Focus on readability over optimization
- No build optimizations needed initially
- Commit messages should be descriptive but short and contain no information about the author or AI tool

## Code Style

- Linting and formatting is done with eslint, eslint-plugin-solid and prettier. Adhere to existing code style.

## Current Focus

- Basic ratio visualization with segmented horizontal bar
- Integer input controlling number of segments
- Real-time updates as user types
