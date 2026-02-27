# Story Carousel Monorepo

StoryKit – Framework-agnostic Instagram-style story list component. Supports React, Vue, Svelte, and Angular with a shared, type-safe core. Features auto-play, progress indicators, pause/hold interactions, NEXT/PREV controls, and customizable themes. Lightweight, easy to integrate, perfect for social feeds, story carousels, and timeline components.

## Architecture

- **`@storykit/core`** - Framework-agnostic core logic written in TypeScript
- **`@storykit/react`** - React wrapper component
- **`@storykit/vue`** - Vue wrapper component
- **`@storykit/svelte`** - Svelte wrapper component
- **`@storykit/angular`** - Angular wrapper component

## Quick Start

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Clone and install dependencies
pnpm install

# Build all packages
pnpm build
```

## Usage

### React

```tsx
import { StoryCarousel } from "@storykit/react";

const stories = [
  { id: "1", content: "Story 1", duration: 3000 },
  { id: "2", content: "Story 2", duration: 4000 },
  { id: "3", content: "Story 3", duration: 5000 },
];

function App() {
  return (
    <div style={{ width: "400px", height: "600px" }}>
      <StoryCarousel
        stories={stories}
        autoPlay={true}
        onStoryEnd={(story) => console.log("Story ended:", story)}
        onComplete={() => console.log("All stories completed")}
      />
    </div>
  );
}
```

### Native (Vanilla JS)

```javascript
import { StoryCarousel } from "@storykit/core";

const stories = [
  { id: "1", content: "Story 1", duration: 3000 },
  { id: "2", content: "Story 2", duration: 4000 },
];

const carousel = new StoryCarousel({
  stories,
  autoPlay: true,
  onStoryEnd: (story) => console.log("Story ended:", story),
  onComplete: () => console.log("All stories completed"),
});

carousel.play();
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm --filter @storykit/react build

# Run tests
pnpm test

# Lint code
pnpm lint

# Clean all builds
pnpm clean
```

## Package Structure

```
packages/
├── native/           # Core TypeScript logic
│   ├── src/
│   │   └── index.ts  # StoryCarousel class and types
│   ├── package.json
│   └── tsconfig.json
├── react/            # React wrapper
│   ├── src/
│   │   ├── index.ts
│   │   └── StoryCarousel.tsx
│   └── package.json
├── vue/              # Vue wrapper (TODO)
├── svelte/           # Svelte wrapper (TODO)
└── angular/          # Angular wrapper (TODO)
```

## Features

- ✅ Framework-agnostic core
- ✅ TypeScript support
- ✅ Auto-play functionality
- ✅ Progress indicators
- ✅ NEXT/PREV controls
- ✅ Pause/hold interactions
- ✅ Customizable durations
- ✅ Event callbacks
- 🔄 React wrapper (implemented)
- ⏳ Vue wrapper (planned)
- ⏳ Svelte wrapper (planned)
- ⏳ Angular wrapper (planned)

## License

MIT
