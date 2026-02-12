# Fast Track Program Sprint Content

## Overview
This directory contains all 32 sprint content files for the Fast Track Performance Program, organized into a clean, structured format.

## Structure

```
frontend/content/
├── index.json                    # Master index linking all sprints to tools
├── sprint-00-woop/
│   ├── content.md               # Full sprint content (preparation guide)
│   └── summary.md               # Quick reference summary
├── sprint-01-know-thyself/
│   ├── content.md
│   └── summary.md
├── ... (30 more sprint directories)
└── sprint-31-digital-heart/
    ├── content.md
    └── summary.md
```

## Modules

### Module 0: Introduction Sprint
- Sprint 00: WOOP

### Module 1: Individual and Company Identity
- Sprint 01: Know Thyself
- Sprint 02: Dream
- Sprint 03: Values
- Sprint 04: Team

### Module 2: Core Element of Performance
- Sprint 05: Fit
- Sprint 06: Cash
- Sprint 07: Energy
- Sprint 08: Goals
- Sprint 09: Focus
- Sprint 10: Performance
- Sprint 11: Meeting Rhythm

### Module 3: The Market
- Sprint 12: Market Size
- Sprint 13: Segmentation
- Sprint 14: Target Segment
- Sprint 15: Value Proposition
- Sprint 16: VP Testing

### Module 4: Business Model
- Sprint 17: Product Development
- Sprint 18: Pricing
- Sprint 19: Brand Marketing
- Sprint 20: Customer Service
- Sprint 21: Route to Market
- Sprint 22: Core Activities
- Sprint 23: Processes
- Sprint 24: Fit ABC

### Module 5: Organization
- Sprint 25: Org Redesign
- Sprint 26: Employer Branding
- Sprint 27: Agile Teams

### Module 6: Technology
- Sprint 28: Digitalization
- Sprint 29: Tech/AI
- Sprint 31: Digital Heart

### Module 7: Implementation
- Sprint 30: Implementation

## Files

### content.md
Full sprint content including:
- Sprint introduction and context
- Individual preparation guide
- Tune-in questions
- Reading materials (Brain Juice & Deep Dive)
- Think and Do exercises
- Team session guides

### summary.md
Quick reference guide including:
- Sprint purpose (1-2 sentences)
- Key decision to make
- Main concepts and frameworks
- Tool sections overview
- Dependencies (previous/next sprints)

### index.json
Master index providing:
- Sprint metadata (number, slug, name, module)
- Links to content and summary files
- Tool HTML file paths (for future tool integration)
- Module groupings

## Usage

### For Development
```javascript
// Load the index
import index from './frontend/content/index.json';

// Find a sprint
const sprint = index.sprints.find(s => s.number === 12);
console.log(sprint.name); // "Market Size"

// Load content
const content = await fetch(`./frontend/content/${sprint.content}`);
const summary = await fetch(`./frontend/content/${sprint.summary}`);
```

### For Tools Integration
Each sprint entry in index.json includes a `tool` path that links to the interactive HTML tool:
```json
{
  "number": 12,
  "slug": "market-size",
  "name": "Market Size",
  "tool": "module-3-market/12-market-size.html",
  "content": "sprint-12-market-size/content.md",
  "summary": "sprint-12-market-size/summary.md"
}
```

## Statistics
- **Total Sprints**: 32
- **Total Modules**: 8
- **Content Files**: 32 × content.md = 32 files
- **Summary Files**: 32 × summary.md = 32 files
- **Total Files**: 64 markdown files + 1 index.json = 65 files

## Next Steps
1. Create HTML tool files in the paths specified in index.json
2. Integrate content loading into tool interfaces
3. Implement navigation between sprints using the dependency information
4. Build dashboard using module and sprint metadata
