#!/bin/bash
npm install --global prisma
npm install typescript
npm install
prisma generate
npx tsc
