# Gitignore Maintenance

## ADDED Requirements

### Requirement: Remove Duplicate Patterns

The `.gitignore` file SHALL contain each pattern exactly once, in the most logical section, to ensure maintainability and prevent inconsistencies.

#### Scenario: Duplicate backup file patterns removed

- **WHEN** reviewing the `.gitignore` file structure
- **THEN** the `*~` pattern should appear only once in the "Backup files" section (line 183)
- **AND** it should not appear in the "Vim" section (previously line 128)
- **AND** it should not appear in the "Emacs" section (previously line 131)
- **AND** all other patterns should remain unchanged

#### Scenario: File behavior unchanged

- **WHEN** git evaluates files for ignoring
- **THEN** the same files should be ignored as before the change
- **AND** no new files should be ignored
- **AND** no previously-ignored files should become tracked
