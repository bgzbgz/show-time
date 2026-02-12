# Cleanup Duplicate .gitignore Patterns

## Why

The `.gitignore` file contains the pattern `*~` (editor backup files) three times across different sections—Vim, Emacs, and Backup files. This redundancy reduces maintainability and creates potential inconsistency if one instance is modified but others aren't.

## What Changes

Remove duplicate `*~` patterns, keeping only the instance in the "Backup files" section where it logically belongs.

## Capabilities

### New Capabilities
- `gitignore-maintenance`: The `.gitignore` file will have cleaner, non-redundant patterns that are easier to maintain

### Modified Capabilities
<!-- None -->

## Impact

- `.gitignore`: Remove lines 128 and 131 (duplicate `*~` patterns)
- No functional change to git behavior
- Improves file maintainability
