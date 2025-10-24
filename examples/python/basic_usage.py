import json
import urllib.parse
import urllib.request
import ssl
import os

API_KEY = "<YOUR_API_KEY>"


def _rpc(endpoint: str, method: str, params: dict) -> dict:
    body = json.dumps({
        "jsonrpc": "2.0",
        "id": os.urandom(6).hex(),
        "method": method,
        "params": params,
    }).encode("utf-8")
    headers = {
        "accept": "application/json, text/event-stream",
        "content-type": "application/json",
    }
    req = urllib.request.Request(endpoint, data=body, headers=headers)
    ctx = ssl._create_unverified_context()
    with urllib.request.urlopen(req, context=ctx) as resp:
        while True:
            line = resp.readline()
            if not line:
                break
            t = line.decode("utf-8", errors="ignore").strip()
            if t.startswith("data:"):
                data_str = t[5:].lstrip()
                try:
                    msg = json.loads(data_str)
                    return msg.get("result", msg)
                except Exception:
                    continue
    return {}


def main() -> int:
    endpoint = f"https://mcp.dataprovider.com/mcp?api-key={urllib.parse.quote(API_KEY)}"

    # 1) Get available fields and choose fields (hostname and cms for this example) for lookup
    fields_res = _rpc(endpoint, "tools/call", {"name": "get_available_fields", "arguments": {}})
    chosen = choose_field_names(fields_res)

    # 2) Create filter from natural language
    sugg_res = _rpc(endpoint, "tools/call", {"name": "create_query_filter", "arguments": {"question": "WordPress sites in US"}})
    dpql_filter = (sugg_res.get("structuredContent") or {}).get("filter")
    if dpql_filter is None:
        raise RuntimeError("create_query_filter did not return a filter")

    # 3) Lookup using the selected fields and returned filter
    lookup_res = _rpc(endpoint, "tools/call", {"name": "lookup_data", "arguments": {"filter": dpql_filter, "fields": chosen, "page": 0, "size": 5}})
    print(json.dumps(lookup_res.get("structuredContent", lookup_res), indent=2))
    return 0


# for this example, we assume access to the 'hostname' and 'cms' fields
def choose_field_names(fields):
    api_names = [f.get("apiName") for f in (fields.get("structuredContent", {}).get("fields", []))]
    if not api_names:
        raise RuntimeError("No fields found")
    return ["hostname", "cms"]


if __name__ == "__main__":
    raise SystemExit(main())
