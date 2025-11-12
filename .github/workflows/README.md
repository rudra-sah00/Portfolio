# GitHub Workflows Documentation

This directory contains all GitHub Actions workflows for the Portfolio project.

## 🌳 Branch Strategy

- **`production`** - Default branch, production-ready code deployed to https://rudrasahoo.live
- **`develop`** - Working branch for active development and testing

## 📋 Workflows Overview

### 1. **CI/CD Pipeline** (`ci.yml`)

**Triggers:** Push to develop, Pull Requests

**Jobs:**

- ✅ **Lint & Type Check** - ESLint, Prettier, TypeScript validation
- ✅ **Test & Coverage** - Jest tests with enhanced coverage reports (390 tests, 90.99% coverage!)
- ✅ **Build** - Next.js production build verification
- ✅ **Security Audit** - npm audit for vulnerabilities

**Features:**

- Visual coverage reports with progress bars and diff indicators
- Detailed metrics breakdown (statements, branches, functions, lines)
- Comments coverage summary on PRs with comparison to base
- Skips draft PRs to save CI minutes
- Concurrency control to cancel outdated runs
- Only runs on develop pushes and PRs (not production)

**Coverage Thresholds:** 90% statements, 85% branches, 80% functions, 90% lines

**Required Checks:** All jobs must pass for PR merge

---

### 2. **Deploy to Production** (`deploy-production.yml`)

**Triggers:** Push to production branch only

**Jobs (Sequential):**

1. ✅ **Quality Checks** - Lint, format check, type check
2. 🧪 **Test & Coverage** - Full test suite + Codecov upload
3. 🏗️ **Build** - Production build verification
4. 🚀 **Deploy** - Vercel production deployment

**Features:**

- Sequential execution ensures each step completes before next
- Comprehensive quality gates before deployment
- Integrated Codecov reporting
- Only one workflow runs on production push (no parallel workflows)

**Environment:** Production (https://rudrasahoo.live)

---

### 3. **Deploy Preview** (`deploy-preview.yml`)

**Triggers:** Pull Requests only

**Jobs:**

- 🔍 **Deploy Preview** - Vercel preview deployment for PRs
- Independent workflow for faster feedback
- No deployment on production pushes

---

### 4. **Code Quality** (`code-quality.yml`)

**Triggers:** Push to develop, Pull Requests

**Jobs:**

- 🎨 **Format Check** - Prettier validation
- 📏 **Lint** - ESLint checks
- 🔍 **Type Check** - TypeScript compiler validation

**Features:**

- Comprehensive code quality enforcement
- Pre-commit validation mirror
- Does not run on production branch

---

### 5. **Lighthouse CI** (`lighthouse.yml`)

**Triggers:** Pull Requests only

**Jobs:**

- 💡 **Performance Testing** - Google Lighthouse audits
- Checks performance, accessibility, best practices, SEO
- Starts Next.js server with health check before testing
- Results uploaded to temporary public storage

---

### 6. **Bundle Size Check** (`bundle-size.yml`)

**Triggers:** Pull Requests only

**Jobs:**

- 📦 **Bundle Analysis** - Reports on bundle sizes
- Tracks size changes in PRs
- Uses standard Next.js build output

---

### 7. **PR Validation** (`pr-validation.yml`)

**Triggers:** PR opened, edited, synchronized, reopened

**Jobs:**

- 📝 **PR Metadata Check** - Validates PR title follows conventional commits
- 🏷️ **Auto Label** - Automatically adds relevant labels based on changed files

**Auto Labels:**

- `size: small/medium/large` - Based on lines changed
- `component` - Component changes
- `tests` - Test file changes
- `documentation` - Markdown changes
- `api` - API route changes
- `styling` - CSS/SCSS changes
- `typescript` - TS/TSX files
- `configuration` - Config changes
- `ci/cd` - Workflow changes
- `dependencies` - package.json changes
- `first-time contributor` - First PR from user

**PR Title Convention:**
Must start with: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `perf:`, `ci:`, or `build:`

---

### 8. **Welcome Contributors** (`welcome-contributors.yml`)

**Triggers:** Pull Requests (pull_request_target)

**Jobs:**

- � **Welcome Message** - Welcomes first-time contributors
- Adds `first-time contributor` label
- Checks for duplicate comments to avoid spam

---

### 9. **Stale PR Management** (`stale.yml`)

**Triggers:** Daily at 00:00 UTC, Manual dispatch

**Settings:**

- **PRs:** Stale after 30 days, closed after 7 more days
- **Issues:** Stale after 60 days, closed after 14 more days
- **Exempt Labels:** `keep-alive`, `in-progress`, `blocked`, `bug`, `enhancement`, `help-wanted`

**Purpose:** Keeps repository clean by managing inactive PRs/issues

---

### 10. **Dependency Updates** (`dependencies.yml`)

**Triggers:** Weekly on Mondays at 09:00 UTC, Manual dispatch

**Jobs:**

- 📦 **Check for Updates** - Scans for outdated npm packages
- Creates/updates issue with outdated dependency report
- Provides table with current, wanted, and latest versions

**Labels:** `dependencies`, `maintenance`

---

### 11. **Codecov Upload** (`codecov.yml`)

**Triggers:** Manual dispatch only (workflow_dispatch)

**Status:** Disabled for automatic runs

**Reason:** Coverage upload now integrated into production deployment workflow test job

---

## 🎯 PR Workflow Process

### For Contributors:

1. **Create PR**
   - PR title must follow conventional commits
   - Fill out PR template completely
   - Link related issues

2. **Automated Actions**
   - ✅ PR validation checks title format
   - 🏷️ Auto-labeling based on files changed
   - 👋 Welcome message (first-time contributors)
   - 🔄 Size label added

3. **CI Pipeline Runs**
   - Code quality checks (lint, format, types)
   - Full test suite (390 tests, 90.99% coverage!)
   - Build verification
   - Security audit
   - Lighthouse performance testing
   - Bundle size analysis
   - Preview deployment

4. **Coverage Report**
   - Visual progress bars with coverage metrics
   - Diff indicators showing coverage changes
   - Detailed breakdown by category
   - Comparison to base branch

5. **Ready for Review**
   - All checks must pass ✅
   - No "skipped" deployment statuses
   - Preview deployment available for testing

6. **Merge to Production**
   - Sequential workflow triggers:
     1. Quality checks (lint, format, type)
     2. Tests + Codecov upload
     3. Production build
     4. Vercel deployment
   - Application deploys to https://rudrasahoo.live

### For Reviewers:

- All automated checks must pass
- Review coverage reports
- Check for security issues
- Verify build succeeds
- Test functionality locally if needed

---

## 🔧 Configuration

### Required Secrets

```yaml
CODECOV_TOKEN         # For coverage uploads
GITHUB_TOKEN          # Automatically provided
NEXT_PUBLIC_SITE_URL  # Optional, defaults to https://rudrasahoo.live
```

### Branch Protection Rules

Recommended settings for `production` branch (default):

- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale reviews
- ✅ Require status checks to pass:
  - `Lint & Type Check`
  - `Test & Coverage`
  - `Build Application`
  - `Security Audit`
  - `Code Quality`
  - `Lighthouse CI`
  - `Bundle Size Check`
- ✅ Require conversation resolution
- ✅ Require linear history
- ✅ Include administrators

Recommended settings for `develop` branch:

- ✅ Require pull request before merging
- ✅ Require status checks to pass (basic set)
- Allow force pushes (for rebasing)

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![CI/CD](https://github.com/rudra-sah00/Portfolio/workflows/CI%2FCD%20Pipeline/badge.svg?branch=production)
![Deploy Production](https://github.com/rudra-sah00/Portfolio/workflows/Deploy%20to%20Production/badge.svg?branch=production)
![Code Quality](https://github.com/rudra-sah00/Portfolio/workflows/Code%20Quality/badge.svg?branch=production)
![Codecov](https://codecov.io/gh/rudra-sah00/Portfolio/branch/production/graph/badge.svg?token=YOUR_CODECOV_TOKEN)
```

---

## 🎨 PR Template

Located at: `.github/PULL_REQUEST_TEMPLATE.md`

Includes sections for:

- Description
- Type of change
- Related issues
- Checklist
- Testing details
- Screenshots/demos
- Additional context

---

## 📝 Issue Templates

Located at: `.github/ISSUE_TEMPLATE/`

Available templates:

1. **🐛 Bug Report** - Report bugs with detailed reproduction steps
2. **✨ Feature Request** - Suggest new features or enhancements
3. **📚 Documentation** - Suggest documentation improvements

---

## 🚀 Manual Workflow Triggers

Some workflows can be triggered manually:

```bash
# Navigate to Actions tab on GitHub
# Select workflow
# Click "Run workflow"
# Choose branch
# Click "Run workflow" button
```

Manually triggerable workflows:

- Codecov Upload (disabled for automatic runs)
- Stale PR Management
- Dependency Updates

---

## 📈 Metrics & Monitoring

### Current Test Status

- **Total Tests:** 390
- **Passing:** 390 ✅
- **Pass Rate:** 100% 🎉
- **Coverage:** 90.99% (see Codecov for detailed reports)
  - Statements: 90.99%
  - Branches: 85.05%
  - Functions: 85.93%
  - Lines: 91.31%

### CI Performance

- **PR Workflows:** Run in parallel for fast feedback (~3-4 minutes)
- **Production Workflow:** Sequential execution (~5-6 minutes total)
  - Quality Checks: ~1 minute
  - Tests: ~2 minutes
  - Build: ~1.5 minutes
  - Deploy: ~30 seconds
- **Concurrency:** Enabled (cancels outdated runs)
- **Caching:** npm dependencies cached

---

## 🔍 Troubleshooting

### Common Issues

**1. PR Title Check Fails**

- Ensure title starts with conventional commit prefix
- Example: `feat: add new component`

**2. Coverage Upload Fails**

- Check CODECOV_TOKEN secret is set
- Verify token is valid

**3. Build Fails**

- Check all environment variables are set
- Verify dependencies are installed correctly
- Review build logs for specific errors

**4. Lighthouse CI Fails**

- Verify server starts successfully
- Check health check endpoint responds
- Increase timeout if needed

**5. Bundle Size Check Issues**

- Ensure standard build completes
- Do not use ANALYZE flag
- Check next.config.ts configuration

**6. Stale Bot Not Working**

- Check workflow is enabled
- Verify GITHUB_TOKEN permissions
- Review exempt labels

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Codecov Documentation](https://docs.codecov.com/)
- [Contributing Guide](../CONTRIBUTING.md)

---

## 🎯 Quick Reference

### PR Labels Guide

| Label                    | Meaning                 | Auto-Applied |
| ------------------------ | ----------------------- | ------------ |
| `size: small`            | < 500 lines changed     | ✅           |
| `size: medium`           | 500-1000 lines          | ✅           |
| `size: large`            | > 1000 lines            | ✅           |
| `component`              | Component files changed | ✅           |
| `tests`                  | Test files changed      | ✅           |
| `documentation`          | Docs changed            | ✅           |
| `api`                    | API routes changed      | ✅           |
| `dependencies`           | Package changes         | ✅           |
| `first-time contributor` | First PR                | ✅           |
| `keep-alive`             | Prevent stale           | Manual       |
| `in-progress`            | Work in progress        | Manual       |
| `blocked`                | Blocked by other work   | Manual       |

---

## 🔄 Workflow Architecture

### PR Workflow (Parallel Execution)

When you open a PR, these workflows run **in parallel** for fast feedback:

```
Pull Request Opened
├── CI/CD Pipeline (lint, test, build, security)
├── Code Quality (format, lint, types)
├── Lighthouse CI (performance testing)
├── Bundle Size Check
├── Deploy Preview (Vercel)
├── PR Validation (labels, title check)
└── Welcome Contributors (first-time only)
```

### Production Deployment (Sequential Execution)

When you merge to production, **one workflow** runs these jobs **sequentially**:

```
Push to Production Branch
└── Deploy to Production Workflow
    ├── 1️⃣ Quality Checks (lint, format, types)
    ├── 2️⃣ Test & Coverage (390 tests + Codecov)
    ├── 3️⃣ Build (Next.js production build)
    └── 4️⃣ Deploy (Vercel production)
```

This ensures:

- ✅ No parallel workflows clogging the Actions tab
- ✅ Each step completes before next begins
- ✅ Clear linear progression
- ✅ Fails fast if any step fails

---

**Last Updated:** November 8, 2025  
**Maintained By:** @rudra-sah00

For questions or issues with workflows, please open an issue with the `ci/cd` label.
