@echo off
REM Claude Desktop MCP launcher: sets cwd to minicrm-mcp-server so .env is found.
REM Usage in claude_desktop_config.json: command = full path to this .cmd, args = []
cd /d "%~dp0.."
if not exist "dist\index.js" (
  echo [minicrm-mcp] Run npm run build first. >&2
  exit /b 1
)
node dist\index.js
