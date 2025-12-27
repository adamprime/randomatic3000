# AGENTS.md - RandoMatic 3000

> A retro-styled randomization playground featuring six unique engines—from spinning wheels to Matrix-style crypto—to help you make decisions through the power of chaos.

## Project Overview

RandoMatic 3000 is a single-page HTML/CSS/JS application that provides multiple randomization engines for running trials and making decisions. Users can input 2-20 options, run multiple trials, and visualize the results.

## Architecture

### File Structure
```
/
├── index.html          # Main single-page application
├── css/
│   └── styles.css      # All styling including engine visualizations
├── js/
│   ├── engines/        # Randomization engines
│   │   ├── base.js     # Base engine interface
│   │   ├── crypto.js   # Crypto Random (Matrix visualization)
│   │   ├── wheel.js    # Wheel Spin
│   │   ├── dice.js     # Dice Roll
│   │   ├── cards.js    # Card Shuffle
│   │   ├── lottery.js  # Lottery Balls
│   │   └── coins.js    # Coin Cascade
│   ├── ui/             # UI components
│   │   ├── options.js  # Options manager
│   │   ├── trials.js   # Trial runner
│   │   └── results.js  # Results display
│   └── app.js          # Main application logic
├── tests/
│   ├── engines/        # Engine unit tests
│   └── ui/             # UI component tests
└── AGENTS.md           # This file
```

### Randomization Engines

All engines implement a common interface:
- `pick(options)` - Select one option from the array
- `shuffle(options)` - Return a shuffled copy of the array
- `visualize(container, options, result)` - Render the visualization

#### 1. Crypto Random (Matrix Theme)
- Uses `crypto.getRandomValues()` for true randomness
- Visualization: Matrix-style falling green characters on black

#### 2. Wheel Spin
- Fisher-Yates with animated wheel
- Visualization: Spinning carnival wheel with color-coded slices

#### 3. Dice Roll
- Simulated dice throws
- Visualization: 3D dice rolling animation

#### 4. Card Shuffle
- Fisher-Yates shuffle
- Visualization: Cards being shuffled and drawn

#### 5. Lottery Balls
- Random ball selection
- Visualization: Tumbling numbered balls

#### 6. Coin Cascade
- Binary random with coin flips
- Visualization: Cascading coin flip animations

## Development Guidelines

### Test-Driven Development
- Write tests BEFORE implementing features
- Tests live in `/tests/` mirroring the source structure
- Use simple vanilla JS testing (no framework dependencies)
- Run tests by opening `tests/index.html` in browser

### Code Style
- Vanilla JavaScript (ES6+), no frameworks
- CSS with custom properties for theming
- Semantic HTML5
- Mobile-responsive design

### Engine Implementation Pattern
```javascript
class EngineName extends BaseEngine {
    constructor() {
        super('Engine Name', 'engine-id');
    }
    
    pick(options) {
        // Return single selected option
    }
    
    shuffle(options) {
        // Return shuffled array
    }
    
    async visualize(container, options, result) {
        // Render animation, return when complete
    }
}
```

## UI Components

### Options Manager
- Minimum 2 options, maximum 20
- Default labels: "Option 1", "Option 2"
- Add/remove buttons
- Text input for each option label

### Trial Runner
- Preset buttons: 25, 50, 100 trials
- Custom trial count input
- Start/Stop controls
- Progress indicator

### Results Display
- Real-time tally during trials
- Bar chart visualization
- Final ranking/consensus
- Option to export results

## Testing Requirements

Each engine must have tests for:
- `pick()` returns valid option from input
- `shuffle()` returns array of same length with same elements
- Statistical distribution is reasonably uniform (chi-square or similar)
- Edge cases (2 options, 20 options)

## Commit Guidelines

- Atomic commits for each feature/fix
- Prefix: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`
- Run tests before committing
