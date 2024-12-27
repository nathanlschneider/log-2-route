<a id="readme-top"></a>
<br />
<div align="center">
  <a href="https://github.com/nathanlschneider/log-2-route">
    <img src="https://github.com/user-attachments/assets/795e4e5f-926b-4c44-ae68-8e1c6d1ba6f7" alt="Logo" width="188.77" height="94.3">
  </a>
<h3 align="center">Log2Route</h3>
  <p align="center">
    <strong>Front and back end Logging for Next.js Apps</strong>
    <br/>
    <div> Track events, debug issues, and keep an eye on performance all in one place! Inspired by other loggers, you can output to either file or console, or both
    using Newline delimited JSON (<a href="https://github.com/ndjson/ndjson-spec">https://github.com/ndjson/ndjson-spec</a>) or a more readable and stylized format for direct viewing. Output with color as well.</div>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#configuration">Configuration</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#dependencies">Dependencies</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

I was looking for an easy-to-use file logger for my Next.js apps, suitable for both development and production, without the need to deploy to Vercel. I tried several popular solutions, but none of them worked well for my use cases, so of course I had to roll my own.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

### Prerequisites
<ul>
  <li>NextJS v14+</li>
  <li>Using the app router</li>
  <li>TypeScript</li>
</ul>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation
Install
  ```bash
  $ npm i log-2-route@latest
  ``` 
Configure
```bash
$ node ./node_modules/log-2-route/dist/config
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage
Importing
```typescript
import { logger } from 'log-2-route'
```

Logging
```typescript
logger.info("messsage")
logger.error("message")
logger.success("message")
logger.debug("message")
logger.warn("message")
```
Example
```typescript
try {
  // codes...
}
catch(e) {
  logger.error((e instanceOf Error).message);
  logger.debug((e instanceOf Error).stack);
}
```
```typescript
logger.success("User has done a thing!");
```
Logger can take multiple arguments and argument types
```typescript
logger.info("User logged in", { level: 1 }, 12345)
```
And if set to styled will log
```typescript
[7378237287] - INFO - User logged in level: 1
```

Output
<ul>
  <li>Formatted</li>
</ul>

```log
[12/23/2024, 7:40:59 AM] INFO - User Rudy Schneider logged in
```

<ul>
  <li>ndjson</li>
</ul>

```log
{"type":"info","time":{"epoch":1734957920354},"data":{"message":"User Rudy Schneider logged in"}}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Configuration
 There will be a l2r.config.json created in the root of your app.

```json
{
    "logFile": {
      "format": "ndjson",
      "enabled": true,
      "fileName": "app.log",
      "location": "./",
      "timeType": "epoch",
      "colorizeStyledLog": false
    },
    "console": {
      "format": "styled",
      "enabled": true
      "timeType": "epoch",
      "colorizeStyledLog": true
    }
  }
```
logFile
<ul>
  <li>format: "ndjson" or "styled"</li>
  <li>enabled: true or false</li>
  <li>fileName: whatever you want the log file to be named.</li>
  <li>location: whever you want the log file to live.</li>
  <li>timeType: "epoch" or "locale" or "timestamp"</li>
  <li>colorizeStyledLog: true or false</li>
</ul>

console
<ul>
  <li>format: "ndjson" or "styled"</li>
  <li>enabled: true or false (console logs are turned off in production enviroments)</li>
  <li>timeType: "epoch" or "locale" or "timestamp"</li>
  <li>colorizeStyledLog: true or false</li>
</ul>


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT. See `LICENSE.txt` for more information.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Nathan Schneider - nlschneider@gmail.com

GitHub: [[https://github.com/nathanlschneider/log-2-route](https://github.com/nathanlschneider/log-2-route)]<br/>
NPM:    [[https://www.npmjs.com/package/log-2-route](https://www.npmjs.com/package/log-2-route)]<br/>
<p align="right">(<a href="#readme-top">back to top</a>)</p>
