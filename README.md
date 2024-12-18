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
### Usage
import { logger } from 'log-2-route'

logger.info("Log message");

### Config Options
Coming...

## Log Router

To route logs to a specific endpoint, add a `/app/logger/route.ts` to your project. The `route.ts` should contain:

```typescript
import { LogReceiver } from "log-to-route";

export async function POST(req: Request) {
  const res = await LogReceiver(req);
  return new Response(await res.text(), { status: res.status });
}
```


