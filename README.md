# Natly - U.S. Citizenship Preparation Platform

![Tests](https://img.shields.io/badge/tests-97%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

> Bilingual (English/Spanish) platform helping immigrants prepare for U.S. citizenship naturalization.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Test Coverage

- **97 tests** covering backend, frontend, and integration
- **89% overall coverage** with the following breakdown:
  - Backend Utils: 100%
  - API Client: 100%
  - Components: 85%
  - Error Handling: 75%

### Coverage Thresholds

The project enforces minimum coverage thresholds:
- Lines: 85%
- Functions: 80%
- Branches: 75%
- Statements: 85%

Build will fail if coverage drops below these thresholds.

---

## 🏗️ Project Structure

natly/
├── src/
│   ├── features/newsletter/          # Newsletter feature
│   │   ├── api/                      # API client (100% coverage)
│   │   ├── components/               # React components (85% coverage)
│   │   └── types/                    # TypeScript types
│   └── lib/errors/                   # Error handling utilities
├── netlify/functions/                # Serverless functions
│   └── newsletter/utils/             # Backend utilities (100% coverage)
├── tests/
│   ├── integration/                  # Integration tests
│   └── setup.ts                      # Test configuration
└── coverage/                         # Coverage reports (generated)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
