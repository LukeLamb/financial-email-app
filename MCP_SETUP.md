# MCP Knowledge Graph Setup for Claude Code Memory

## Installation

1. **Install the MCP Knowledge Graph server:**
   ```bash
   npm install -g @modelcontextprotocol/server-knowledge-graph
   ```

2. **Create MCP configuration file** (in VS Code settings):
   ```json
   {
     "mcpServers": {
       "knowledge-graph": {
         "command": "npx",
         "args": ["@modelcontextprotocol/server-knowledge-graph"],
         "env": {
           "KNOWLEDGE_GRAPH_PATH": "./knowledge-graph.db"
         }
       }
     }
   }
   ```

## VS Code Configuration

Add to your VS Code settings.json:
```json
{
  "claude.mcpServers": {
    "knowledge-graph": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-knowledge-graph"],
      "cwd": "${workspaceFolder}",
      "env": {
        "KNOWLEDGE_GRAPH_PATH": "${workspaceFolder}/knowledge-graph.db"
      }
    }
  }
}
```

## Usage in Claude Code

Once configured, Claude Code will be able to:
- **Remember project context** across sessions
- **Store development decisions** and rationale
- **Track component relationships** and dependencies
- **Maintain conversation history** about the codebase
- **Remember user preferences** and coding patterns

## Knowledge Graph Entities

The system will automatically track:
- **Components**: React components and their props/state
- **APIs**: Gmail API, Ollama integration points
- **Dependencies**: Package relationships and versions
- **Architecture**: File structure and module connections
- **Decisions**: Technical choices and their reasoning

## Commands

- `mcp:add-knowledge` - Add new information to the graph
- `mcp:search` - Search existing knowledge
- `mcp:relate` - Create relationships between entities
- `mcp:context` - Get project context for current task

## Benefits

1. **Persistent Memory**: Claude Code remembers your project across sessions
2. **Context Awareness**: Better understanding of codebase structure
3. **Decision Tracking**: Why certain technical choices were made
4. **Faster Development**: Less need to re-explain project details
5. **Pattern Recognition**: Learns your coding preferences and patterns

## Example Usage

When you run `/init` in Claude Code, it will:
1. Scan your project structure
2. Read CLAUDE.md for project overview
3. Store component relationships in knowledge graph
4. Remember your development preferences
5. Maintain context for future sessions

This creates a much more intelligent and context-aware development assistant!
