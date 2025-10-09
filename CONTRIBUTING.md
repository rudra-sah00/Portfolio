# Contributing to Portfolio

First off, thank you for considering contributing to this project! 🎉

## 🌟 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and what you expected
- Include screenshots if applicable
- Note your environment (OS, browser, Node version)

### ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Include mockups or examples if applicable

### 🔧 Pull Requests

#### Before You Start

1. Check if there's an existing issue for what you're working on
2. If not, create one to discuss your proposed changes
3. Fork the repository and create your branch from `main`

#### PR Process

1. **Fork & Clone**

   ```bash
   git clone https://github.com/YOUR-USERNAME/Portfolio.git
   cd Portfolio
   ```

2. **Create a Branch**

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

   Branch naming conventions:
   - `feat/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation changes
   - `refactor/` - Code refactoring
   - `test/` - Test updates
   - `chore/` - Maintenance tasks

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

5. **Test Your Changes**

   ```bash
   # Run linter
   npm run lint

   # Run type check
   npm run type-check

   # Run tests
   npm test

   # Run tests with coverage
   npm run test:coverage

   # Test the build
   npm run build
   ```

6. **Commit Your Changes**

   Use conventional commits:

   ```bash
   git commit -m "feat: add new dashboard component"
   git commit -m "fix: resolve navigation bug"
   git commit -m "docs: update README"
   ```

   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Test changes
   - `chore:` - Maintenance tasks
   - `perf:` - Performance improvements
   - `ci:` - CI/CD changes

7. **Push to Your Fork**

   ```bash
   git push origin feat/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template completely
   - Link any related issues

## 📋 Code Style

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow the ESLint and Prettier configurations
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### React Components

- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Follow the Single Responsibility Principle
- Use semantic HTML

### CSS

- Use CSS Modules or Tailwind classes
- Follow BEM naming convention for custom CSS
- Keep styles modular and scoped
- Prefer Tailwind utilities when possible

### Testing

- Write tests for new features
- Maintain or improve code coverage
- Use descriptive test names
- Test edge cases and error scenarios
- Mock external dependencies

## 🔍 Code Review Process

1. **Automated Checks**
   - All tests must pass
   - Code coverage must meet minimum thresholds
   - Linting must pass
   - Type checking must pass
   - Build must succeed

2. **Manual Review**
   - Code quality and readability
   - Test coverage and quality
   - Documentation completeness
   - Performance considerations
   - Security implications

3. **Feedback**
   - Address reviewer comments
   - Make requested changes
   - Re-request review when ready

## 🎯 Development Setup

### Prerequisites

- Node.js 20+ and npm
- Git
- A code editor (VS Code recommended)

### Local Development

```bash
# Clone the repository
git clone https://github.com/rudra-sah00/Portfolio.git

# Navigate to directory
cd Portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Add other required variables
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Testing Library Documentation](https://testing-library.com/docs)

## ❓ Questions?

Feel free to:

- Open a discussion
- Comment on existing issues
- Reach out to maintainers

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort! 💙

---

**Happy Contributing!** 🚀
