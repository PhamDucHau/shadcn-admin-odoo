# AGENTS.md - Development Guide for Shadcn Admin Dashboard

This document provides comprehensive information for AI agents and developers working with this Shadcn Admin Dashboard codebase.

## Project Overview

This is a modern React admin dashboard built with Vite, TypeScript, and ShadcnUI components. It features authentication, data management, and a responsive design with RTL support.

### Key Technologies

- **Frontend**: React 19.2.3 + TypeScript
- **Build Tool**: Vite 7.3.0 with SWC
- **UI Framework**: ShadcnUI (TailwindCSS + RadixUI)
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand for auth, TanStack Query for server state
- **Authentication**: Custom auth with JWT tokens + Clerk integration support
- **Styling**: TailwindCSS 4.1.18 with custom components
- **Form Handling**: React Hook Form + Zod validation
- **Data Fetching**: Axios with TanStack Query
- **Icons**: Lucide React

## Architecture Overview

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadcnUI components (customized for RTL)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   └── data-table/     # Data table components
├── context/            # React context providers
├── features/           # Feature-based modules
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── users/          # User management
│   ├── employees/      # Employee management
│   ├── departments/    # Department management
│   ├── contacts/       # Contact management
│   ├── tasks/          # Task management
│   ├── settings/       # Settings pages
│   └── errors/         # Error pages
├── lib/                # Utility functions
├── routes/             # File-based routing (TanStack Router)
├── stores/             # Zustand stores
└── styles/             # Global styles
```

### Key Patterns

1. **Feature-Based Architecture**: Each business domain (users, employees, etc.) has its own folder with components, logic, and types.

2. **File-Based Routing**: Routes are defined in `src/routes/` using TanStack Router's file-based convention.

3. **Component Composition**: Complex UIs are built by composing smaller, reusable components.

4. **Type Safety**: Full TypeScript implementation with strict type checking.

## Development Commands

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run knip            # Find unused files and exports

# Type Checking
npm run type-check      # Run TypeScript compiler (if configured)
```

### Development Server

- **Port**: Default Vite port (usually 5173)
- **API Proxy**: Backend requests are proxied to `http://localhost:5001`
- **Hot Module Replacement**: Enabled with React SWC

## Key Components and Features

### Authentication System

- **Location**: `src/stores/auth-store.ts`, `src/features/auth/`
- **Method**: JWT token-based authentication
- **Storage**: Browser cookies for token persistence
- **Flow**: 
  1. User signs in via `/sign-in` route
  2. Token stored in cookies via `src/lib/cookies.ts`
  3. Protected routes check token in `src/routes/_authenticated/route.tsx`
  4. API requests include token via `src/lib/api.ts` interceptor

### Data Tables

- **Location**: `src/components/data-table/`
- **Features**: 
  - Sorting, filtering, pagination
  - Bulk actions
  - Row actions
  - Faceted filters
  - Column visibility controls
- **Usage**: Each feature (users, employees, etc.) implements its own table with specific columns

### Layout System

- **Main Layout**: `src/components/layout/authenticated-layout.tsx`
- **Sidebar**: `src/components/layout/app-sidebar.tsx`
- **Features**:
  - Collapsible sidebar with state persistence
  - RTL support
  - Responsive design
  - Theme switching (light/dark mode)

### Form Handling

- **Library**: React Hook Form + Zod
- **Validation**: Schema-based validation with Zod
- **UI**: ShadcnUI form components
- **Pattern**: Each feature has its own form components and validation schemas

## Important Files

### Configuration Files

- `vite.config.ts` - Vite configuration with proxy setup
- `tsconfig.json` - TypeScript configuration with path aliases
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - TailwindCSS configuration

### Core Files

- `src/main.tsx` - Application entry point
- `src/routes/__root.tsx` - Root route with providers
- `src/lib/api.ts` - Axios instance with auth interceptor
- `src/stores/auth-store.ts` - Authentication state management
- `src/lib/utils.ts` - Utility functions (cn helper, etc.)

## Development Guidelines

### Component Development

1. **Follow Feature-Based Structure**: Keep feature-related components in their respective feature folders.

2. **Use ShadcnUI Components**: Leverage the existing UI components in `src/components/ui/`. Note that many are customized for RTL support.

3. **TypeScript First**: All new components should be fully typed.

4. **Responsive Design**: Use Tailwind's responsive utilities and the container query pattern (`@container/content`).

### State Management

- **Global State**: Use Zustand stores (currently only auth-store)
- **Server State**: Use TanStack Query for API calls and caching
- **Local State**: Use React useState/useReducer

### Routing

- Use TanStack Router's file-based routing
- Protected routes should extend `_authenticated` layout
- Follow the existing route naming conventions

### API Integration

- Use the configured `api` instance from `src/lib/api.ts`
- Implement proper error handling with `src/lib/handle-server-error.ts`
- Use TanStack Query for data fetching and caching

### Styling

- Use TailwindCSS classes
- Leverage the `cn` utility for conditional classes
- Follow the existing design system patterns
- Test both LTR and RTL layouts

## Testing and Code Quality

### Linting and Formatting

- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting with import sorting
- **Knip**: Detects unused files and dependencies

### Before Committing

1. Run `npm run lint` to check for linting errors
2. Run `npm run format` to format code
3. Run `npm run build` to ensure production build works
4. Test functionality in development server

## API Integration

The application expects a backend API running on `http://localhost:5001` (configurable via `VITE_API_URL`).

### Endpoints Used

- Authentication: `/login`, `/me`
- Health check: `/health`
- CRUD operations for: users, employees, departments, contacts, tasks

### Error Handling

- Implemented in `src/lib/handle-server-error.ts`
- Global error handling via TanStack Query
- User-friendly error messages with toast notifications

## Special Considerations

### RTL Support

Many ShadcnUI components have been customized for RTL support. When updating these components via Shadcn CLI, manual merging may be required to preserve RTL modifications.

### Performance

- Uses React SWC for fast development builds
- Implements code splitting with TanStack Router
- Container queries for responsive components
- Optimized bundle with Vite

### Accessibility

- Semantic HTML structure
- Skip-to-main functionality
- Proper ARIA labels
- Keyboard navigation support

## Common Tasks

### Adding a New Feature

1. Create feature folder in `src/features/`
2. Add route file in `src/routes/_authenticated/`
3. Implement table components following existing patterns
4. Add navigation items to sidebar data
5. Update TypeScript types

### Adding New UI Components

1. Add to `src/components/ui/` following ShadcnUI patterns
2. Export from appropriate barrel files
3. Add stories if needed

### API Integration

1. Define types in feature folder
2. Use TanStack Query hooks with proper error handling
3. Update API client if new endpoints needed

This guide should help agents understand the codebase structure and development patterns when working on this Shadcn Admin Dashboard project.

## UI Improvement Recommendations

### Priority 1: High Impact

#### Data Visualization
- **Dashboard Charts**: Add more interactive charts using Recharts
  - Real-time data updates with WebSocket integration
  - Drilling capabilities on chart elements
  - Export functionality for charts (PNG, PDF, CSV)
- **KPI Cards**: Add trend indicators and sparklines
- **Progress Indicators**: Add skeleton loaders and progress bars for async operations

#### User Experience
- **Search Enhancement**: Implement global search with fuzzy matching and recent searches
- **Keyboard Shortcuts**: Add comprehensive keyboard navigation
  - `Ctrl+K` for command palette
  - `Ctrl+/` for shortcuts help
  - Arrow key navigation in tables and menus
- **Empty States**: Add meaningful empty states with CTAs
- **Loading States**: Improve loading indicators and skeleton screens

#### Performance
- **Virtualization**: Implement virtual scrolling for large datasets
- **Lazy Loading**: Add intersection observer for images and components
- **Bundle Optimization**: Implement code splitting at component level
- **Caching**: Add service worker for offline functionality

### Priority 2: Medium Impact

#### Tables & Data Management
- **Advanced Filtering**: Add complex filter builders with date ranges
- **Column Pinning**: Allow users to pin important columns
- **Cell Editing**: Implement inline editing with validation
- **Export Features**: Add Excel, PDF export with formatting
- **Bulk Operations**: Enhance bulk actions with progress tracking

#### Forms & Input
- **Autocomplete**: Add intelligent autocomplete with API suggestions
- **Field Dependencies**: Implement conditional field visibility
- **Multi-step Forms**: Add wizard-style forms with progress
- **Rich Text Editor**: Integrate for text areas with formatting

#### Navigation & Layout
- **Breadcrumbs**: Add contextual breadcrumbs
- **Tab Groups**: Implement tabbed interfaces for related content
- **Quick Actions**: Add floating action buttons for common tasks
- **Mini Sidebar**: Add collapsed sidebar mode with icon-only navigation

### Priority 3: Nice to Have

#### Advanced Features
- **Dark Mode Enhancement**: Add system preference detection and custom themes
- **Accessibility**: Add screen reader improvements and high contrast mode
- **Internationalization**: Add multi-language support with i18n
- **Analytics**: Add user behavior tracking and heatmaps

#### Visual Polish
- **Micro-interactions**: Add subtle animations and transitions
- **Toast Enhancements**: Add progress bars and action buttons to notifications
- **Drag & Drop**: Implement drag-drop for file uploads and reordering
- **Tooltips**: Add contextual help and keyboard shortcuts info

### Implementation Strategy

#### Phase 1 (Immediate)
1. **Search Enhancement** - Implement global command palette
2. **Loading States** - Add skeleton loaders throughout
3. **Empty States** - Create meaningful empty states
4. **Keyboard Shortcuts** - Add basic navigation shortcuts

#### Phase 2 (Short-term)
1. **Data Visualization** - Enhance dashboard with interactive charts
2. **Advanced Tables** - Add column pinning and inline editing
3. **Export Features** - Implement CSV, Excel, PDF exports
4. **Dark Mode Polish** - Improve dark theme consistency

#### Phase 3 (Medium-term)
1. **Performance Optimization** - Implement virtualization
2. **Form Enhancements** - Add multi-step forms and autocomplete
3. **Offline Support** - Add service worker and caching
4. **Accessibility Improvements** - WCAG compliance audit

### Technical Considerations

#### State Management
- Consider adding more Zustand stores for UI state (theme, preferences, recent searches)
- Implement optimistic updates for better perceived performance

#### Component Library
- Create a storybook for component documentation
- Add design tokens for consistent spacing, colors, typography
- Implement component composition patterns for better reusability

#### Performance Monitoring
- Add performance monitoring with React Profiler integration
- Implement bundle analysis with webpack-bundle-analyzer
- Add Core Web Vitals tracking

### Design System Enhancements

#### Color Palette
- Expand color palette for better data visualization
- Add semantic color tokens for status, alerts, categories
- Ensure WCAG AA compliance for all color combinations

#### Typography
- Implement fluid typography with clamp()
- Add more font weights for better hierarchy
- Consider adding a monospace font for code display

#### Spacing & Layout
- Implement CSS Grid for complex layouts
- Add container query patterns for responsive components
- Use logical properties for better RTL support

### Mobile Experience

#### Responsive Tables
- Implement card view for mobile tables
- Add horizontal scroll with column freezing
- Touch-friendly row actions

#### Touch Interactions
- Add swipe gestures for navigation
- Implement pull-to-refresh for data tables
- Touch-optimized tap targets (minimum 44px)

### Testing Strategy

#### Visual Testing
- Add Chromatic for visual regression testing
- Implement screenshot testing for critical user flows
- Test dark/light mode variations

#### Accessibility Testing
- Integrate axe-core for automated a11y testing
- Add keyboard navigation tests
- Test with screen readers

These recommendations aim to enhance the user experience while maintaining the clean, professional aesthetic of the Shadcn Admin Dashboard.