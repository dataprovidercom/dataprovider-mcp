const API_KEY = "<YOUR_ACCESS_TOKEN>";

function buildEndpoint(apiKey: string): string {
    return `https://mcp.dataprovider.com/mcp?api-key=${encodeURIComponent(apiKey)}`;
}

async function rpc(endpoint: string, method: string, params: any = {}): Promise<any> {
    const body = {jsonrpc: "2.0", id: Math.random().toString(36).slice(2), method, params} as const;
    const resp = await fetch(endpoint, {
        method: "POST",
        headers: {"accept": "application/json, text/event-stream", "content-type": "application/json"},
        body: JSON.stringify(body),
    });
    const msg = await readData(resp);
    return (msg as any).result ?? msg;
}

function extractFilter(obj: any): any {
    return obj.structuredContent.filter;
}

function extractLookup(obj: any): any {
    return obj.structuredContent;
}

function extractApiNames(obj: any): string[] {
    if (!Array.isArray(obj?.structuredContent?.fields)) return [];
    return obj.structuredContent.fields
        .map((f: any) => f?.apiName)
        .filter((v: any) => typeof v === "string");
}

// for this example, we assume access to the 'hostname' and 'cms' fields
function chooseFieldNames(availableFieldsRes: any) {
    const availableApiNames = extractApiNames(availableFieldsRes);
    if (availableApiNames.length === 0) throw new Error("No fields found");
    return ["hostname", "cms"];
}

async function main() {
    const endpoint = buildEndpoint(API_KEY);
    const question = "WordPress sites in US";

    // 1) Get available fields and choose fields (hostname and cms for this example) for lookup
    const availableFieldsRes: any = await rpc(endpoint, "tools/call", {
        name: "get_available_fields",
        arguments: {}
    });

    // 2) Create filter from natural language
    const filterResult: any = await rpc(endpoint, "tools/call", {
        name: "create_query_filter",
        arguments: {question: question}
    });
    const filter = extractFilter(filterResult);
    if (!filter) throw new Error("create_query_filter did not return a filter");

    // 3) Lookup using the selected fields and returned filter
    const lookupRes = await rpc(endpoint, "tools/call", {
        name: "lookup_data",
        arguments: {filter: filter, fields: chooseFieldNames(availableFieldsRes), page: 0, size: 5}
    });
    console.log(JSON.stringify(extractLookup(lookupRes), null, 2));
}

async function readData(resp: Response): Promise<any> {
    const reader = resp.body?.getReader();
    if (!reader) return {};
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
        const {value, done} = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {stream: true});
        const idx = buffer.indexOf("data:");
        if (idx !== -1) {
            const rest = buffer.slice(idx + 5).trim();
            try {
                return JSON.parse(rest);
            } catch {
            }
        }
    }
    return {};
}

main().catch(err => {
    console.error(err);
});
