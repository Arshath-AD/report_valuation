from fastmcp import FastMCP
from tool_loader.loader import load_yaml_tools

mcp = FastMCP("Dynamic MCP 🚀")

load_yaml_tools(mcp)

if __name__ == "__main__":
    mcp.run()