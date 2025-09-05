# Product Requirements Document: Ratio Visualizer

## Purpose of application

- In brewing filter coffee manually, such that hot water is poured over coffee grounds in a paper filter which is in a dripper set over a mug or server, the amount of water can be split into several pours, typically no more than 5. The amount of water poured is tracked with a scale. This application helps in calculating the pour amounts.
- The total amount of water in grams is determined by the amount of coffee grounds in grams, as well as the ratio of coffee to water. The ratio is expressed as for example 1:15, meaning 1 part coffee to 15 parts of water. When deciding these quantities, typically the ratio is known in advance, and either the amount of water must be solved for (knowing the desired amount of coffee grounds to use), or the amount of coffee must be solved for (optimizing for easy to divide amount of water, for example dividing 250 g of water into 5 50 g pours)
- This application helps in:
  1.  Calculating the amounts based on two known factors
  2.  Calculating and visualizing the number of desired pours based on the total amount of water
- As the brewer is pouring water, they're looking at the amount of total water poured in the scale. The segment visualization should therefore have checkpoints for the total amount of water. For example, if 300 g of water is divided into 3 100 g pours or segments, the lines dividing the segments in the visualization should serve as checkpoints 0 g, 100 g, 200 g and 300 g.
- Additionally brewers often place importance on the first pour, or the "bloom" which is meant to wet the grounds, allowing the release of CO2. The amount of water is typically 2-3 times the weight of the coffee grounds. It should be possible to take the bloom into account as a separate pour, even if the remaining water is then divided into equal pours.

## Completed features

- Ratio visualization with segmented, proportional horizontal bar
- Integer input controlling number of segments
- Real-time updates as user types
- Coffee to water calculator with intelligent last change wins reactive approach
- Hooking up the calculated water amount to the segment and ratio visualization
- Basic testing

## Current Focus

- Looking into simple unit testing

## Commit Message Guidelines

- IMPORTANT: Commit messages should be descriptive but short and contain no information about the author or AI tool
  - DO NOT add any ads such as "Generated with Claude Code"
- Only generate the message for staged files/changes
- Don't add any files using git add. The user will decide what to add
- Ignore changes to CLAUDE.md in the commit message

## Technical Specifications

- **Framework**: SolidJS
- **Build Tool**: Vite
- **Dependencies**: Only solid-js and vite (dev dependency)
- **No additional libraries** for styling, routing or state management
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

## Code Style

- Linting and formatting is done with eslint, eslint-plugin-solid and prettier. Adhere to existing code style.

## Bash Commands

- **Development**: `npm run dev` - Start local development server with hot-reloading
- **Build**: `npm run build` - Build production bundle
- **Preview**: `npm run preview` - Preview production build locally
- **Test**: `npm test` - Run test suite with Vitest
- **Lint**: `npm run lint` - Check code for linting issues
- **Lint Fix**: `npm run lint:fix` - Automatically fix linting issues
- **Format**: `npm run format` - Format code with Prettier
- **Format Check**: `npm run format:check` - Check if code is properly formatted
