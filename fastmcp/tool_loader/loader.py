import os
import yaml


TYPE_MAP = {
    "integer": "int",
    "string": "str",
    "number": "float",
    "boolean": "bool"
}


def load_yaml_tools(mcp):
    tools_dir = os.path.join(os.path.dirname(__file__), "..", "tools")

    for file in os.listdir(tools_dir):
        if file.endswith(".yaml"):
            path = os.path.join(tools_dir, file)

            with open(path, "r") as f:
                config = yaml.safe_load(f)

            register_tool(mcp, config)


def register_tool(mcp, config):
    name = config["name"]
    description = config.get("description", "")
    properties = config["inputSchema"]["properties"]
    expression = config["operation"]["expression"]

    # Build parameter string
    params = []
    for field, field_info in properties.items():
        py_type = TYPE_MAP.get(field_info["type"], "str")
        params.append(f"{field}: {py_type}")

    param_str = ", ".join(params)

    # Build function code
    function_code = f"""
def {name}({param_str}):
    \"\"\"{description}\"\"\"
    return {expression}
"""

    local_scope = {}
    exec(function_code, {}, local_scope)

    dynamic_function = local_scope[name]

    mcp.tool(dynamic_function)