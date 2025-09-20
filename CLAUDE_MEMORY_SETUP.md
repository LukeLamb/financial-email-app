# Claude Code Memory Setup (File-Based)

## Simple Approach: Enhanced CLAUDE.md

Since the MCP knowledge graph server isn't readily available, we can create a robust file-based memory system that Claude Code can use effectively.

## Files for Claude Code Memory

### 1. CLAUDE.md (Project Overview)

- Current project status and architecture
- Component relationships and dependencies
- Development decisions and rationale

### 2. DEVELOPMENT_LOG.md (Session Memory)

- Track what was worked on each session
- Problems encountered and solutions
- Feature additions and changes

### 3. COMPONENT_MAP.md (Code Structure)

- Detailed component documentation
- State management patterns
- API integration points

### 4. TODO.md (Task Tracking)

- Current tasks and priorities
- Completed features
- Future enhancement plans

## VS Code Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "files.associations": {
    "CLAUDE.md": "markdown",
    "DEVELOPMENT_LOG.md": "markdown",
    "COMPONENT_MAP.md": "markdown"
  },
  "markdown.preview.openMarkdownLinks": "inTab",
  "editor.wordWrap": "on"
}
```

## Usage Pattern

1. **Start each session**: Update DEVELOPMENT_LOG.md with session goals
2. **During development**: Update CLAUDE.md with any architectural changes
3. **End each session**: Log what was accomplished and next steps
4. **Before major changes**: Update COMPONENT_MAP.md with new structures

This gives Claude Code rich context about your project without needing external MCP servers.
