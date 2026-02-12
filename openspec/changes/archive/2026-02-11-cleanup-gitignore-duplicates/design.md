# Design: Cleanup Duplicate .gitignore Patterns

## Context

The `.gitignore` file currently has 257 lines organized into sections by category (IDE, OS, Dependencies, etc.). The pattern `*~` appears in three locations:
- Line 128 under "# Vim"
- Line 131 under "# Emacs"
- Line 183 under "# Backup files"

## Goals / Non-Goals

**Goals:**
- Remove redundant patterns to improve maintainability
- Keep the pattern in the most semantically appropriate section
- Preserve all existing git ignore behavior

**Non-Goals:**
- Not reorganizing other sections of .gitignore
- Not adding new patterns
- Not changing comments or formatting beyond the duplicate removal

## Decisions

### Decision 1: Keep pattern in "Backup files" section

**Rationale:** While `*~` is used by Vim and Emacs specifically, it's fundamentally a backup file pattern. The "Backup files" section (line 183) already contains similar patterns like `*.backup`, `*.bak`, `*.old`, making it the most semantically correct location.

**Alternative considered:** Could keep one in each editor section, but this violates DRY principle and creates maintenance burden.

### Decision 2: Simple line deletion approach

**Approach:** Remove lines 128 and 131 directly. No other changes needed.

**Risk:** None - pattern matching in .gitignore is order-independent, and the remaining instance covers all use cases.
