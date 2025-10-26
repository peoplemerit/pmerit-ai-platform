#!/bin/bash

# Script to create GitHub labels for Phase 3.3-A issues
# Run this script BEFORE creating the issues if labels don't exist

set -e

echo "Creating GitHub labels for Phase 3.3-A..."
echo "=========================================="

# Phase label
gh label create "phase:3.3" --color "0052CC" --description "Phase 3.3 - Virtual Human integration" --force || true

# Area labels
gh label create "area:frontend" --color "1D76DB" --description "Frontend/UI development" --force || true
gh label create "area:workers" --color "5319E7" --description "Cloudflare Workers/API" --force || true
gh label create "area:ux" --color "D93F0B" --description "User experience" --force || true
gh label create "area:infra" --color "006B75" --description "Infrastructure setup" --force || true
gh label create "area:qa" --color "C5DEF5" --description "Quality assurance" --force || true

# Type labels
gh label create "type:epic" --color "3E4B9E" --description "Epic tracking issue" --force || true
gh label create "type:feature" --color "0E8A16" --description "New feature" --force || true
gh label create "type:chore" --color "FEF2C0" --description "Maintenance/chore task" --force || true
gh label create "type:enhancement" --color "A2EEEF" --description "Enhancement to existing feature" --force || true
gh label create "type:security" --color "EE0701" --description "Security-related" --force || true
gh label create "type:performance" --color "FBCA04" --description "Performance optimization" --force || true
gh label create "type:testing" --color "C5DEF5" --description "Testing" --force || true
gh label create "type:docs" --color "0075CA" --description "Documentation" --force || true
gh label create "type:infra" --color "006B75" --description "Infrastructure" --force || true

# Priority labels
gh label create "priority:P1" --color "D93F0B" --description "High priority" --force || true
gh label create "priority:P2" --color "FBCA04" --description "Medium priority" --force || true

echo ""
echo "=========================================="
echo "Labels created successfully!"
echo "=========================================="
echo ""
echo "You can now run: ./create-phase-3.3A-issues.sh"
