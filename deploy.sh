#!/usr/bin/env bash
set -e  # exit on first error

# 🎨 Colours
GREEN='[0;32m'
CYAN='[0;36m'
NC='[0m' # No Colour

echo -e "${CYAN}✨ Running pre‑deploy checks...${NC}"

# ✅ Lint
echo -e "${GREEN}👉 Running lint...${NC}"
npm run lint

# ✅ Format
echo -e "${GREEN}👉 Running prettier format...${NC}"
npm run format

# ✅ Build
echo -e "${GREEN}👉 Building project...${NC}"
npm run build

# ✅ Deploy
echo -e "${GREEN}👉 Deploying to Firebase...${NC}"
firebase deploy

echo -e "${CYAN}✅ Deployment complete!${NC}"