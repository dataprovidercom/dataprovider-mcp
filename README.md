## 🌟 Overview

The Dataprovider.com MCP server gives AI assistants and MCP-compatible clients instant access to live web data from
Dataprovider.com

- Endpoint: `https://mcp.dataprovider.com/mcp`
- Authentication: API key via header `X-API-Key` or query param `?api-key=YOUR_API_KEY`

## ⚡ Quick Start

There are 3 ways to connect with the Dataprovider.com MCP

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

## 📚 Examples

See `examples/` for TypeScript, Python, and PHP examples. Each example:

- Declares an API key variable you must fill in
- Lists available tools
- Calls `get_available_fields`, `create_query_filter`, and `lookup_data`

Each examples subfolder contains its own README with setup and run instructions.

## 🔐 Authentication

- Query parameter: `?api-key=YOUR_API_KEY`
- Or header: `X-API-Key: YOUR_API_KEY`

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

## 🛠️ Tool Reference & Usage

### get_available_fields()

- What it does: Lists all fields available to your subscription with names, groups, and types.
- Use when: Before building any filter; to get the exact field names.
- Usage:

```json
{
  "tool": "get_available_fields",
  "params": {}
}
```

### create_query_filter(question)

- What it does: Converts natural language into a structured DPQL filter.
- Use when: You know the question but not the DPQL syntax.
- Usage:

```json
{
  "tool": "create_query_filter",
  "params": {
    "question": "WordPress sites in the USA"
  }
}
```

### lookup_data(filter, fields, page, size, date?, sort_field?, sort_order?)

- What it does: Retrieves records matching a DPQL filter with selected fields; supports pagination and sorting.
- Use when: You need actual records.
- Usage:

```json
{
  "tool": "lookup_data",
  "params": {
    "filter": {
      "type": "operator",
      "operator": "AND",
      "queries": [
        {
          "type": "predicate",
          "predicate": "EQUALS",
          "field": "cms",
          "value": "WordPress"
        }
      ]
    },
    "fields": [
      "hostname",
      "cms"
    ],
    "page": 0,
    "size": 20,
    "sort_field": "hostname",
    "sort_order": "ASC"
  }
}
```

### analyze_trends(filter, fields, months, date?)

- What it does: Returns monthly time-series for specified fields.
- Use when: You want trends over time.
- Usage:

```json
{
  "tool": "analyze_trends",
  "params": {
    "filter": {
      "type": "operator",
      "operator": "AND",
      "queries": []
    },
    "fields": [
      "cms"
    ],
    "months": 6
  }
}
```

### aggregate_data(filter, fields, size, include_source, date?)

- What it does: Aggregates distributions of values for fields; returns counts per value.
- Use when: You need breakdowns (e.g., by country, cms).
- Usage:

```json
{
  "tool": "aggregate_data",
  "params": {
    "filter": {
      "type": "operator",
      "operator": "AND",
      "queries": []
    },
    "fields": [
      "country"
    ],
    "size": 50,
    "include_source": false
  }
}
```

### get_website_traffic(hostname, start_date?, end_date?)

- What it does: Returns Connection Index trend for a hostname.
- Use when: You want traffic trends for a site.
- Usage:

```json
{
  "tool": "get_website_traffic",
  "params": {
    "hostname": "example.com"
  }
}
```

### discover_field_values(query)

- What it does: Searches across all fields to find where a value appears and how often.
- Use when: Exploring which fields contain a term before building filters.
- Usage:

```json
{
  "tool": "discover_field_values",
  "params": {
    "query": "WordPress"
  }
}
```

### find_similar_websites(hostname, size?, fields?, date?)

- What it does: Finds websites similar to a given hostname, with similarity scores.
- Use when: Competitor or lookalike discovery.
- Usage:

```json
{
  "tool": "find_similar_websites",
  "params": {
    "hostname": "example.com",
    "size": 10
  }
}
```

### perform_reverse_dns_lookup(ip_address, page?, size?, fields?, date?)

- What it does: Returns reverse DNS records for an IP address.
- Use when: Investigating domains/hostnames on an IP.
- Usage:

```json
{
  "tool": "perform_reverse_dns_lookup",
  "params": {
    "ip_address": "8.8.8.8",
    "page": 0,
    "size": 20
  }
}
```
