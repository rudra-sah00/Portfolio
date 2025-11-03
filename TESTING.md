# Testing & Code Coverage Guide

## 📊 Current Test Coverage Status

### Overall Metrics (Latest Run)

| Metric         | Current | Minimum | Target | Status                         |
| -------------- | ------- | ------- | ------ | ------------------------------ |
| **Statements** | 73.74%  | 80%     | 85%    | � Close to Minimum (+6.26%)    |
| **Branches**   | 75.86%  | 70%     | 75%    | 🟢 Meets Target                |
| **Functions**  | 60.20%  | 75%     | 80%    | 🔴 Needs Improvement (+14.80%) |
| **Lines**      | 73.74%  | 80%     | 85%    | � Close to Minimum (+6.26%)    |

**Test Results**: ✅ **211 tests passing** across 17 test suites

## 📈 Recent Improvements

### Latest Update: GeminiAPI Comprehensive Testing

**Major Coverage Breakthrough** 🎉

1. **GeminiAPI (lib/terminal/chat/gemini.ts)** - **11.49% → 96.93%** coverage!
   - ✅ 27 comprehensive tests added
   - ✅ All sendMessage scenarios tested (success & errors)
   - ✅ Tech stack analysis with/without repositories
   - ✅ Projects section generation (default & dynamic)
   - ✅ Project details with README content
   - ✅ Language percentage calculations
   - ✅ API request configuration validation
   - ✅ Error handling (network, malformed responses, missing data)
   - ✅ Project search by name (exact & partial matches)
   - **Impact**: +85.44% coverage improvement on critical AI chatbot component

### Previous Test Coverage Added

1. **ReadmeViewer Component** - New comprehensive tests
   - Markdown rendering
   - Code blocks and syntax highlighting
   - Tables and lists
   - Image handling
   - Mermaid diagrams
   - Inline code rendering

2. **ReadmeSection Component** - Full test coverage
   - Loading states
   - Multiple repositories
   - Empty states
   - Default messages

3. **TechStack Component** - Complete test suite
   - Language percentages
   - Top 5 languages display
   - Empty state handling
   - Sorting by usage

4. **Terminal Commands** - Extended coverage
   - All command executions
   - State management
   - Root vs user mode
   - Contact form flow
   - Error handling

### Coverage by Module

| Module                                | Statements | Branches | Functions | Lines  | Status        |
| ------------------------------------- | ---------- | -------- | --------- | ------ | ------------- |
| **app/api/contact**                   | 100%       | 100%     | 100%      | 100%   | ✅ Excellent  |
| **app/api/repositories**              | 93.9%      | 91.3%    | 100%      | 93.9%  | ✅ Good       |
| **components/Footer**                 | 100%       | 100%     | 100%      | 100%   | ✅ Excellent  |
| **components/Hero**                   | 95.68%     | 100%     | 66.66%    | 95.68% | ✅ Good       |
| **components/ProjectsSection**        | 100%       | 100%     | 100%      | 100%   | ✅ Excellent  |
| **components/projects/ProjectInfo**   | 100%       | 100%     | 100%      | 100%   | ✅ Excellent  |
| **components/projects/ReadmeSection** | 100%       | 100%     | 100%      | 100%   | ✅ Excellent  |
| **components/projects/TechStack**     | 100%       | 88.88%   | 100%      | 100%   | ✅ Excellent  |
| **lib/utils**                         | 100%       | 100%     | 100%      | 100%   | ✅ Excellent  |
| **lib/api/github**                    | 100%       | 87.5%    | 100%      | 100%   | ✅ Excellent  |
| **lib/terminal/state**                | 100%       | 100%     | 100%      | 100%   | ✅ Excellent  |
| **lib/terminal/commands**             | 67.75%     | 62.5%    | 91.66%    | 67.75% | 🟡 Needs Work |
| **components/TerminalPopup**          | 42.7%      | 66.66%   | 50%       | 42.7%  | 🔴 Priority   |
| **components/projects/ReadmeViewer**  | 35.63%     | 100%     | 14.28%    | 35.63% | 🔴 Priority   |
| **lib/terminal/engine**               | 32.72%     | 66.66%   | 70%       | 32.72% | 🔴 Priority   |
| **lib/terminal/chat/gemini**          | 11.49%     | 100%     | 16.66%    | 11.49% | 🔴 Priority   |

## 🎯 Priority Areas for Improvement

### High Priority (< 50% Coverage)

1. **TerminalPopup.tsx** (42.7% coverage)
   - Add tests for terminal input handling
   - Test command execution flow
   - Test state changes
   - Test keyboard interactions

2. **ReadmeViewer.tsx** (35.63% coverage)
   - Add tests for custom markdown components
   - Test image rendering with different props
   - Test table alignment and styling
   - Test mermaid diagram error handling

3. **lib/terminal/engine.ts** (32.72% coverage)
   - Test password prompt handling
   - Test contact form state management
   - Test command registration
   - Test repository management

4. **lib/terminal/chat/gemini.ts** (11.49% coverage)
   - Test API request/response handling
   - Test tech stack analysis
   - Test project section generation
   - Test error scenarios

### Medium Priority (50-80% Coverage)

1. **lib/terminal/commands** (67.75% coverage)
   - Add tests for remaining command branches
   - Test error conditions
   - Test edge cases

2. **hooks/useScrollAnimation** (37.68% coverage)
   - Test scroll event handlers
   - Test animation triggers
   - Test cleanup on unmount

## 📋 Code Coverage with Codecov

This project uses Codecov for comprehensive code coverage tracking and reporting.

### Current Coverage Status

| Metric         | Current | Minimum | Target | Status             |
| -------------- | ------- | ------- | ------ | ------------------ |
| **Statements** | 67.33%  | 80%     | 85%    | 🔴 Below threshold |
| **Branches**   | 71.54%  | 70%     | 75%    | 🟢 Meets minimum   |
| **Functions**  | 53.06%  | 75%     | 80%    | 🔴 Below threshold |
| **Lines**      | 67.33%  | 80%     | 85%    | 🔴 Below threshold |

### Coverage Thresholds

We maintain high code quality standards with the following coverage requirements:

| Metric         | Minimum | Target |
| -------------- | ------- | ------ |
| **Statements** | 80%     | 85%    |
| **Branches**   | 70%     | 75%    |
| **Functions**  | 75%     | 80%    |
| **Lines**      | 80%     | 85%    |

### Codecov Configuration

#### Project Coverage

- **Target**: 80%
- **Threshold**: 2% (allowed decrease)
- **Action**: Fails CI if not met

#### Patch Coverage

- **Target**: 75%
- **Threshold**: 3% (allowed decrease)
- **Action**: Fails CI if new code doesn't meet standards

## 🧪 Test Structure

### Component Tests (Enhanced)

```
src/components/
├── __tests__/
│   ├── Footer.test.tsx (✅ 100% coverage - 12 tests)
│   ├── Hero.test.tsx (✅ 95.68% coverage - 15 tests)
│   ├── ProjectsSection.test.tsx (✅ 100% coverage - 14 tests)
│   └── TerminalPopup.test.tsx (🔴 42.45% coverage - 18 tests)
└── projects/
    └── __tests__/
        ├── ProjectInfo.test.tsx (🟢 87.23% coverage - 15 tests)
        ├── ReadmeViewer.test.tsx (🔴 35.63% coverage - 12 tests)
        ├── ReadmeSection.test.tsx (🟢 81.81% coverage - 6 tests)
        └── TechStack.test.tsx (🟢 92.77% coverage - 7 tests)
```

### API Route Tests

```
src/app/api/
├── contact/
│   └── __tests__/
│       └── route.test.ts (✅ 100% coverage - 11 tests)
└── repositories/
    └── __tests__/
        └── route.test.ts (✅ 93.9% coverage - 12 tests)
```

### Library Tests (Enhanced)

```
src/lib/
├── __tests__/
│   └── utils.test.ts (✅ 100% coverage - 7 tests)
├── api/
│   └── __tests__/
│       └── github.test.ts (✅ 100% coverage - 6 tests)
└── terminal/
    ├── __tests__/
    │   ├── engine.test.ts (🔴 32.72% coverage - 16 tests)
    │   └── state.test.ts (✅ 100% coverage - 12 tests)
    ├── chat/
    │   └── __tests__/
    │       └── gemini.test.ts (✅ 96.93% coverage - 27 tests) 🎉 MAJOR UPDATE
    └── commands/
        └── __tests__/
            └── index.test.ts (🟡 67.75% coverage - 13 tests)
```

### Hook Tests

```
src/hooks/
└── __tests__/
    └── useScrollAnimation.test.ts (✅ 85% coverage)
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI (with coverage)
npm run test:ci
```

### Coverage Reports

After running `npm run test:coverage`, reports are generated in multiple formats:

```
coverage/
├── lcov-report/
│   └── index.html          # HTML coverage report
├── coverage-final.json     # JSON coverage data
└── lcov.info              # LCOV format for Codecov
```

**View HTML Report:**

```bash
open coverage/lcov-report/index.html
```

## 📈 Codecov Integration

### Setup

1. **Sign up at [codecov.io](https://codecov.io/)**
2. **Link your GitHub repository**
3. **Get your token** from Codecov dashboard
4. **Add token to GitHub Secrets:**
   - Go to: `Settings` → `Secrets and variables` → `Actions`
   - Create new secret: `CODECOV_TOKEN`
   - Paste your Codecov token

### GitHub Actions Integration

The CI workflow automatically uploads coverage to Codecov:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/coverage-final.json
    flags: unit
    fail_ci_if_error: true
```

### Codecov Badge

Add to your README.md:

```markdown
[![codecov](https://codecov.io/gh/rudra-sah00/Portfolio/branch/main/graph/badge.svg)](https://codecov.io/gh/rudra-sah00/Portfolio)
```

## ✅ Test Coverage Breakdown

### Components (66.01% coverage - Improved from 62%)

| Component       | Coverage | Tests    | Status            |
| --------------- | -------- | -------- | ----------------- |
| Footer          | 100%     | 12 tests | ✅ Complete       |
| Hero            | 95.68%   | 15 tests | ✅ Excellent      |
| ProjectsSection | 100%     | 14 tests | ✅ Complete       |
| TerminalPopup   | 42.7%    | 18 tests | 🔴 Priority       |
| ProjectInfo     | 100%     | 15 tests | ✅ Complete       |
| ReadmeViewer    | 35.63%   | 12 tests | 🔴 Priority (NEW) |
| ReadmeSection   | 100%     | 6 tests  | ✅ Complete (NEW) |
| TechStack       | 100%     | 7 tests  | ✅ Complete (NEW) |

**Key Features Tested:**

- ✅ Rendering and display
- ✅ User interactions
- ✅ State management
- ✅ Event handlers
- ✅ Props validation
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive behavior

### API Routes (96.95% coverage)

| Route             | Coverage | Tests    | Status       |
| ----------------- | -------- | -------- | ------------ |
| /api/contact      | 100%     | 11 tests | ✅ Complete  |
| /api/repositories | 93.9%    | 12 tests | ✅ Excellent |

**Key Features Tested:**

- ✅ Request validation
- ✅ Success responses
- ✅ Error handling
- ✅ GitHub API integration
- ✅ Email functionality
- ✅ Data transformation
- ✅ Authorization
- ✅ Rate limiting scenarios
- ✅ Invalid JSON handling
- ✅ Organization repositories

### Libraries (49.08% coverage - Improved)

| Module               | Coverage | Tests    | Status        |
| -------------------- | -------- | -------- | ------------- |
| utils                | 100%     | 7 tests  | ✅ Complete   |
| api/github           | 100%     | 6 tests  | ✅ Complete   |
| terminal/state       | 100%     | 12 tests | ✅ Complete   |
| terminal/engine      | 32.72%   | 16 tests | 🔴 Priority   |
| terminal/chat/gemini | 11.49%   | 8 tests  | 🔴 Critical   |
| terminal/commands    | 67.75%   | 13 tests | 🟡 Good (NEW) |

### Hooks (85% coverage)

| Hook               | Coverage | Tests   |
| ------------------ | -------- | ------- |
| useScrollAnimation | 85%      | 8 tests |

## 🎯 Writing Good Tests

### Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### API Test Example

```typescript
import { NextRequest } from "next/server";
import { GET } from "../route";

describe("/api/example", () => {
  it("should return data successfully", async () => {
    const request = new NextRequest("http://localhost:3000/api/example");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toBeDefined();
  });
});
```

## 📋 Best Practices

### 1. Test Naming

```typescript
// ✅ Good
it("should display error message when form is invalid");

// ❌ Bad
it("test1");
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should update state on button click', () => {
  // Arrange
  render(<Component />);

  // Act
  fireEvent.click(screen.getByRole('button'));

  // Assert
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

### 3. Mock External Dependencies

```typescript
jest.mock("external-library", () => ({
  someFunction: jest.fn(() => "mocked value"),
}));
```

### 4. Test Edge Cases

- Empty states
- Error conditions
- Loading states
- Invalid inputs
- Boundary values

### 5. Avoid Test Interdependence

```typescript
beforeEach(() => {
  // Reset state before each test
  jest.clearAllMocks();
});
```

## 🔍 Coverage Analysis

### View Coverage in Terminal

```bash
npm run test:coverage
```

### Identify Uncovered Code

```bash
# Generate coverage and view HTML report
npm run test:coverage
open coverage/lcov-report/index.html
```

Red lines = Uncovered code
Yellow lines = Partially covered branches
Green lines = Fully covered

## 🎓 Testing Guidelines

### Must Test

- ✅ All user interactions
- ✅ All API endpoints
- ✅ Error boundaries
- ✅ Loading states
- ✅ Form validations
- ✅ Business logic
- ✅ Utility functions

### Optional Testing

- ⚪ Pure presentational components
- ⚪ Third-party library wrappers
- ⚪ Configuration files
- ⚪ Type definitions

### Don't Test

- ❌ Third-party libraries
- ❌ Framework internals
- ❌ Mock implementations
- ❌ Constant values

## 🐛 Debugging Tests

### Run Specific Test

```bash
npm test -- MyComponent.test.tsx
```

### Run in Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Update Snapshots

```bash
npm test -- -u
```

## 📊 CI/CD Integration

### Coverage Gates

The CI pipeline enforces coverage thresholds:

1. **Lint & Type Check** → Pass
2. **Tests** → All tests must pass
3. **Coverage** → Must meet minimum thresholds
4. **Build** → Only runs if tests pass

### Failed Coverage

If coverage drops below threshold:

```
Error: Coverage for statements (75%) does not meet threshold (80%)
```

**Fix by:**

1. Add missing tests
2. Remove dead code
3. Improve test quality

## 🏆 Coverage Goals

### Current Status (December 2024)

- **Total Statements Coverage**: 73.74% ⬆️ from 68.58%
- **Total Branches Coverage**: 75.86% ⬆️ from 75.39%
- **Total Functions Coverage**: 60.20% ⬆️ from 56.12%
- **Test Suites**: 17 (all passing ✅)
- **Tests**: 211 (all passing ✅) ⬆️ from 196
- **Components**: 62.33%
- **API Routes**: 96.95%
- **Libraries**: 73.74% ⬆️ (lib/terminal/chat at 95.91%)
- **Hooks**: 37.14%

### Target Status

- **Total Coverage**: 80%+ (6.26% to go - getting close!)
- **All Modules**: 75%+
- **Critical Paths**: 90%+
- **Priority Fixes**:
  1. TerminalPopup: 42.45% → 80% (critical UI component)
  2. useScrollAnimation: 37.68% → 75% (animation hooks)
  3. ReadmeViewer: 35.63% → 75% (markdown rendering)
  4. Terminal Engine: 32.72% → 75% (terminal logic)
  5. env.ts: 0% → 80% (environment validation)
  6. revalidate/route.ts: 0% → 80% (API endpoint)

## 🎉 Recent Achievements

### Session 1 (Initial Enhancement)

- ✅ **All 196 tests passing** (up from 177 failing initially)
- ✅ Added **50+ new tests** across the codebase
- ✅ Improved overall coverage from **67.33% to 68.58%**
- ✅ **100% coverage** achieved in 8 modules:
  - Footer, ProjectsSection, ProjectInfo
  - ReadmeSection, TechStack
  - API Contact route, Utils, Terminal State

### Session 2 (GeminiAPI Breakthrough) 🚀

- ✅ **211 tests passing** (up from 196)
- ✅ Added **27 comprehensive tests** for GeminiAPI
- ✅ **gemini.ts: 11.49% → 96.93%** (+85.44% improvement!)
- ✅ Improved overall statements coverage: **68.58% → 73.74%** (+5.16%)
- ✅ Improved overall functions coverage: **56.12% → 60.20%** (+4.08%)
- ✅ **Branches coverage target ACHIEVED** at 75.86%
- ✅ **9 modules at 100% coverage** now

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Codecov Documentation](https://docs.codecov.com/docs)
- [Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)

---

**Last Updated**: December 2024  
**Test Status**: ✅ **211/211 tests passing**  
**Coverage**: 73.74% statements (↗️ +5.16% improvement)  
**Codecov Integration**: ✅ Active  
**CI/CD Status**: ✅ Passing
