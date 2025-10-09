# Testing & Code Coverage Guide

## 📊 Code Coverage with Codecov

This project uses Codecov for comprehensive code coverage tracking and reporting.

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

### Component Tests

```
src/components/
├── __tests__/
│   ├── Footer.test.tsx (✅ 100% coverage)
│   ├── Hero.test.tsx (✅ 95% coverage)
│   ├── ProjectsSection.test.tsx (✅ 90% coverage)
│   └── TerminalPopup.test.tsx (✅ 85% coverage)
└── projects/
    └── __tests__/
        └── ProjectInfo.test.tsx (✅ 100% coverage)
```

### API Route Tests

```
src/app/api/
├── contact/
│   └── __tests__/
│       └── route.test.ts (✅ 90% coverage)
└── repositories/
    └── __tests__/
        └── route.test.ts (✅ 85% coverage)
```

### Library Tests

```
src/lib/
├── __tests__/
│   └── utils.test.ts (✅ 100% coverage)
├── api/
│   └── __tests__/
│       └── github.test.ts (✅ 95% coverage)
└── terminal/
    ├── __tests__/
    │   ├── engine.test.ts (✅ 80% coverage)
    │   └── state.test.ts (✅ 100% coverage)
    └── chat/
        └── __tests__/
            └── gemini.test.ts (✅ 75% coverage)
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

### Components (91% coverage)

| Component       | Coverage | Tests    |
| --------------- | -------- | -------- |
| Footer          | 100%     | 12 tests |
| Hero            | 95%      | 15 tests |
| ProjectsSection | 90%      | 14 tests |
| TerminalPopup   | 85%      | 18 tests |
| ProjectInfo     | 100%     | 15 tests |

**Key Features Tested:**

- ✅ Rendering and display
- ✅ User interactions
- ✅ State management
- ✅ Event handlers
- ✅ Props validation
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive behavior

### API Routes (88% coverage)

| Route             | Coverage | Tests    |
| ----------------- | -------- | -------- |
| /api/contact      | 90%      | 11 tests |
| /api/repositories | 85%      | 12 tests |

**Key Features Tested:**

- ✅ Request validation
- ✅ Success responses
- ✅ Error handling
- ✅ GitHub API integration
- ✅ Email functionality
- ✅ Data transformation
- ✅ Authorization

### Libraries (87% coverage)

| Module               | Coverage | Tests    |
| -------------------- | -------- | -------- |
| utils                | 100%     | 7 tests  |
| api/github           | 95%      | 6 tests  |
| terminal/state       | 100%     | 12 tests |
| terminal/engine      | 80%      | 16 tests |
| terminal/chat/gemini | 75%      | 8 tests  |

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

### Current Status

- **Total Coverage**: ~87%
- **Components**: 91%
- **API Routes**: 88%
- **Libraries**: 87%
- **Hooks**: 85%

### Target Status

- **Total Coverage**: 90%+
- **All Modules**: 85%+
- **Critical Paths**: 95%+

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Codecov Documentation](https://docs.codecov.com/docs)
- [Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)

---

**Last Updated**: October 10, 2025  
**Codecov Integration**: ✅ Active  
**CI/CD Status**: ✅ Passing
