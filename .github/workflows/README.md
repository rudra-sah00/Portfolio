# GitHub Workflows Documentation

This directory contains all GitHub Actions workflows for the Portfolio project.

## 📋 Workflows Overview

### 1. **CI/CD Pipeline** (`ci.yml`)

**Triggers:** Push to main/develop, Pull Requests to main/develop

**Jobs:**

- ✅ **Lint & Type Check** - ESLint, Prettier, TypeScript validation
- ✅ **Test & Coverage** - Jest tests with coverage reports (100% pass rate!)
- ✅ **Build** - Next.js production build verification
- ✅ **Security Audit** - npm audit for vulnerabilities
- ✅ **PR Status Check** - Final status for PRs with auto-comment

**Features:**

- Runs on all PRs (open, sync, reopen, ready_for_review)
- Skips draft PRs to save CI minutes
- Uploads coverage reports to Codecov
- Comments coverage summary on PRs
- Concurrency control to cancel outdated runs

**Required Checks:** All jobs must pass for PR merge

---

### 2. **PR Validation** (`pr-validation.yml`)

**Triggers:** PR opened, edited, synchronized, reopened

**Jobs:**

- 📝 **PR Metadata Check** - Validates PR title follows conventional commits
- 🏷️ **Auto Label** - Automatically adds relevant labels based on changed files
- 👋 **PR Welcome** - Welcomes first-time contributors

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

### 3. **Deploy to Production** (`deploy.yml`)

**Triggers:** Push to main, Manual dispatch

**Jobs:**

- 🚀 **Deploy to Vercel** - Production deployment verification
- Runs full test suite before deployment
- Creates deployment success notifications

**Environment:** Production (https://rudrasahoo.live)

---

### 4. **Stale PR Management** (`stale.yml`)

**Triggers:** Daily at 00:00 UTC, Manual dispatch

**Settings:**

- **PRs:** Stale after 30 days, closed after 7 more days
- **Issues:** Stale after 60 days, closed after 14 more days
- **Exempt Labels:** `keep-alive`, `in-progress`, `blocked`, `bug`, `enhancement`, `help-wanted`

**Purpose:** Keeps repository clean by managing inactive PRs/issues

---

### 5. **Dependency Updates** (`dependencies.yml`)

**Triggers:** Weekly on Mondays at 09:00 UTC, Manual dispatch

**Jobs:**

- 📦 **Check for Updates** - Scans for outdated npm packages
- Creates/updates issue with outdated dependency report
- Provides table with current, wanted, and latest versions

**Labels:** `dependencies`, `maintenance`

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
   - Lint & Type Check
   - Tests (100% coverage!)
   - Build verification
   - Security audit

4. **Coverage Report**
   - Comment added to PR with coverage metrics
   - Codecov integration for detailed reports

5. **Ready for Review**
   - All checks must pass ✅
   - Auto-comment confirms PR is ready

6. **Merge to Main**
   - Deployment workflow triggers
   - Application deploys to production

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

Recommended settings for `main` branch:

- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale reviews
- ✅ Require status checks to pass:
  - `Lint & Type Check`
  - `Test & Coverage`
  - `Build Application`
  - `Security Audit`
- ✅ Require conversation resolution
- ✅ Require linear history
- ✅ Include administrators

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![CI/CD](https://github.com/rudra-sah00/Portfolio/workflows/CI%2FCD%20Pipeline/badge.svg)
![PR Validation](https://github.com/rudra-sah00/Portfolio/workflows/PR%20Validation/badge.svg)
![Deploy](https://github.com/rudra-sah00/Portfolio/workflows/Deploy%20to%20Production/badge.svg)
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

- Deploy to Production
- Stale PR Management
- Dependency Updates

---

## 📈 Metrics & Monitoring

### Current Test Status

- **Total Tests:** 159
- **Passing:** 159 ✅
- **Pass Rate:** 100% 🎉
- **Coverage:** High (see Codecov for details)

### CI Performance

- **Average Run Time:** ~2 minutes
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

**4. Stale Bot Not Working**

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

**Last Updated:** October 10, 2025  
**Maintained By:** @rudra-sah00

For questions or issues with workflows, please open an issue with the `ci/cd` label.
