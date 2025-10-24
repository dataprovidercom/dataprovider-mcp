## PHP Example — Setup & Run

### Prerequisites

- PHP 8.0+
- Internet access
- Your Dataprovider.com API key

### Configure

1. Open `basic_usage.php`
2. Set the `$API_KEY`

### Run

```bash
php basic_usage.php
```

The script will:

- Get your available fields with `get_available_fields`
- Suggest a filter with `create_query_filter`
- Fetch records with `lookup_data`


