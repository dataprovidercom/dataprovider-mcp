## 🌟 Overview

The Dataprovider.com MCP server gives AI assistants and MCP-compatible clients instant access to live web data from
Dataprovider.com — no infrastructure, no scraping, just structured tools you can call.

- Endpoint: `https://mcp.dataprovider.com/mcp`
- Authentication: API key via header `X-API-Key` or query param `?api-key=YOUR_API_KEY`

## ⚡ Quick Start

Use the hosted server. No installation required.

1) With query parameter

`https://mcp.dataprovider.com/mcp?api-key=YOUR_API_KEY`

2) With header

- `X-API-Key: YOUR_API_KEY`
- URL: `https://mcp.dataprovider.com/mcp`

3) Connect from MCP clients (e.g., Claude Desktop)

- Settings → Connectors → Add custom connector
- Name: `Dataprovider MCP`
- URL: `https://mcp.dataprovider.com/mcp?api-key=YOUR_API_KEY`
- Save

## ✨ Features

- Hosted MCP endpoint with API key authentication
- Clean the tool surface aligned with the Dataprovider.com backend
- High-level helper tools for discovery and filter creation
- Pagination, sorting, time windows, and aggregation support

## 🔧 Available Tools

- `get_available_fields()`
- `create_query_filter(question)`
- `lookup_data(filter, fields, page, size, date?, sort_field?, sort_order?)`
- `analyze_trends(filter, fields, months, date?)`
- `aggregate_data(filter, fields, size, include_source, date?)`
- `get_website_traffic(hostname, start_date?, end_date?)`
- `discover_field_values(query)`
- `find_similar_websites(hostname, size?, fields?, date?)`
- `perform_reverse_dns_lookup(ip_address, page?, size?, fields?, date?)`

These are discoverable via the MCP tools listing in compatible clients.

## 🧭 Typical Workflow

1. `get_available_fields()` to learn field names in your subscription.
2. `create_query_filter(question)` to convert natural language into a DPQL filter.
3. Use the filter with:
    - `lookup_data` (records)
    - `analyze_trends` (time series)
    - `aggregate_data` (distributions)
4. Or the other tools:
    - `discover_field_values` (value discovery across fields)
    - `find_similar_websites` (similarity search)
    - `perform_reverse_dns_lookup` (reverse DNS)
    - `get_website_traffic` (traffic trend data)

## 📚 Examples

See `examples/` for TypeScript, Python, and PHP examples. Each example:

- Declares an API key variable you must fill in
- Lists available tools
- Calls `get_available_fields`, `create_query_filter`, and `lookup_data`

Each examples subfolder contains its own README with setup and run instructions.

## 🔐 Authentication

- Query parameter: `?api-key=YOUR_API_KEY`
- Or header: `X-API-Key: YOUR_API_KEY`
