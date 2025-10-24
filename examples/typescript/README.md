## TypeScript Example — Setup & Run

### Prerequisites

- Node.js 18+
- Internet access
- Your Dataprovider.com access token

### Configure

1. Open `basic-usage.ts`
2. Set the `API_KEY`

### Run

You can run the example using npx ts-node (uses /examples/typescript/tsconfig.json)

```bash
npx ts-node basic-usage.ts
```

The script will:

- Get your available fields with `get_available_fields`
- Suggest a filter with `create_query_filter`
- Fetch records with `lookup_data`


