# Log-to-route (l2r)

## l2r.config.json

Create an `l2r.config.json` file in the root of your app and add the following:

```json
{
  "logFile": {
    "format": "styled",
    "enabled": true,
    "fileName": "app.log",
    "location": "./",
    "timeType": "epoch",
    "colorizeStyledLog": false
  },
  "console": {
    "format": "styled",
    "enabled": true,
    "timeType": "locale",
    "colorizeStyledLog": true
  }
}
```

### Config Options

- **format**: `"styled"` or `"ndjson"`
  - `styled`: Logs or displays a formatted line.
  - `ndjson`: Logs or displays a newline-delimited JSON string.

- **enabled**: `true` or `false`
  - Sets whether the console output or logfile output is enabled.

- **filename**: `"<filename>.<ext>"`
  - The filename you wish to use for the log file.

- **location**: `"./"`
  - Log file location.

- **timeType**: `"epoch"`, `"iso"`, or `"dateTime"`
  - `epoch`: The epoch time in seconds since 1/1/1970 (e.g., `17627282892`).
  - `iso`: The ISO 8743 specified timestamp typically used in SQL databases (e.g., `12/12/2025T00:00:00Z`).
  - `dateTime`: Displays your locale date and time in a formatted string (e.g., `12/12/2025, 01:25:00PM`).

- **colorizeStyledLog**:
  - Adds coloring via Chalk to the formatted log for either console or logfile.

## Log Router

To route logs to a specific endpoint, add a `/app/logger/route.ts` to your project. The `route.ts` should contain:

```typescript
import { LogReceiver } from "log-to-route";

export async function POST(req: Request) {
  const res = await LogReceiver(req);
  return new Response(await res.text(), { status: res.status });
}
```


