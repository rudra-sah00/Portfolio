#!/bin/bash

# Portfolio Production Setup Script
# This script helps set up the production environment

set -e

echo "🚀 Portfolio Production Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found package.json"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Setup Husky
echo "🎣 Setting up Husky git hooks..."
npm run prepare
chmod +x .husky/*
echo -e "${GREEN}✓${NC} Husky configured"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔐 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠${NC}  Please update .env.local with your actual values"
else
    echo -e "${GREEN}✓${NC} .env.local already exists"
fi
echo ""

# Run type check
echo "🔍 Running type check..."
npm run type-check
echo -e "${GREEN}✓${NC} Type check passed"
echo ""

# Run linter
echo "🔍 Running linter..."
npm run lint
echo -e "${GREEN}✓${NC} Lint check passed"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test -- --passWithNoTests
echo -e "${GREEN}✓${NC} Tests passed"
echo ""

# Generate coverage report
echo "📊 Generating coverage report..."
npm run test:coverage
echo -e "${GREEN}✓${NC} Coverage report generated"
echo ""

# Build the project
echo "🏗️  Building project..."
npm run build
echo -e "${GREEN}✓${NC} Build successful"
echo ""

echo "=============================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your actual credentials"
echo "2. Set up Codecov:"
echo "   - Go to https://codecov.io/"
echo "   - Link your repository"
echo "   - Add CODECOV_TOKEN to GitHub Secrets"
echo "3. Run 'npm run dev' to start development"
echo "4. Run 'npm run validate' before committing"
echo ""
echo "Documentation:"
echo "- Production Setup: PRODUCTION_SETUP.md"
echo "- Testing Guide: TESTING.md"
echo "- Complete Summary: COMPLETE_SUMMARY.md"
echo ""
echo "Happy coding! 🎉"
