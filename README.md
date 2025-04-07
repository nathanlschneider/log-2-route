# Error-Aware Client API Documentation

## Overview
This API endpoint provides a secure way to process signed payloads with built-in error handling and rate limiting.

## Security Requirements
- HTTPS protocol only
- IP whitelist enforced
- Request signing required
- Rate limit: 100 requests per minute
- Maximum request size: 1MB

## Request Format

### Headers
```json
{
  "Content-Type": "application/json",
  "x-platform-origin": "qwerkly-platform",
  "x-forwarded-proto": "https"
}
```

### Body Structure
```typescript
{
  "payload": {
    // Your data as key-value pairs
    [key: string]: unknown
  },
  "signature": string // Base64 encoded signature
}
```

## Signing Requests

### Using the Provided Utility
```typescript
import { signPayload } from "./signPayload";

const payload = {
  message: "Hello World",
  timestamp: Date.now()
};

const signedPayload = signPayload(payload);
```

### Manual Signing Process
1. Convert payload to JSON string
2. Sign using SHA-256 algorithm
3. Encode signature in Base64

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "received": {
    // Echo of your payload
  },
  "requestId": "unique-request-identifier"
}
```

### Error Response
```json
{
  "error": "Error message",
  "requestId": "unique-request-identifier"
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Invalid JSON or Missing Fields |
| 403  | Unauthorized or Invalid Signature |
| 408  | Request Timeout (5s limit) |
| 413  | Payload Too Large |
| 429  | Rate Limit Exceeded |
| 500  | Internal Server Error |

## Example Implementation

```typescript
async function makeApiRequest(data: Record<string, unknown>) {
  try {
    const signedPayload = signPayload(data);
    
    const response = await fetch('https://your-api-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-platform-origin': 'qwerkly-platform',
        'x-forwarded-proto': 'https'
      },
      body: JSON.stringify(signedPayload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

## Error Types

```typescript
enum ErrorType {
  RATE_LIMIT = "Rate limit exceeded",
  INVALID_IP = "Unauthorized IP",
  INVALID_PROTOCOL = "HTTPS required",
  INVALID_ORIGIN = "Invalid origin header",
  INVALID_SIGNATURE = "Invalid signature",
  TIMEOUT = "Request timeout",
  PAYLOAD_TOO_LARGE = "Request too large",
  INVALID_JSON = "Invalid JSON payload",
  MISSING_FIELDS = "Missing payload or signature",
  INTERNAL_ERROR = "Internal server error"
}
```

## Setup Requirements

1. Generate key pair:
```bash
# Generate private key
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Extract public key
openssl rsa -pubout -in private.pem -out public.pem
```

2. Place `private.pem` in client directory
3. Configure server with `public.pem`
4. Update allowed IPs in server configuration

## Connection Verification

### Request Format
```typescript
{
  "payload": {
    "verificationType": "connection",
    "platformId": string,
    "timestamp": number // Unix timestamp in milliseconds
  },
  "signature": string
}
```

### Verification Response
```typescript
{
  "success": true,
  "verified": true,
  "platformId": string,
  "requestId": string
}
```

### Headers
- `X-Request-ID`: Unique request identifier
- `X-Verification-Time`: Server timestamp of verification

### Verification Rules
- Request must be signed like normal requests
- Timestamp must be within last 5 minutes
- Platform ID must match expected format
- All security checks (IP, origin, etc.) still apply

### Example
```typescript
const verificationPayload = {
  verificationType: 'connection',
  platformId: 'your-platform-id',
  timestamp: Date.now()
};

const signedPayload = signPayload(verificationPayload);
const response = await makeApiRequest(signedPayload);
```
