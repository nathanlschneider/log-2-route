<a id="readme-top"></a>
<br />
<div align="center">
  <a href="https://github.com/nathanlschneider/log-2-route">
    <img src="https://github.com/user-attachments/assets/16c7f17e-26c6-4fd1-a266-bf22e90d0e48" alt="Logo" width="188.77" height="94.3">
  </a>
<h3 align="center">Log2Route</h3>

  <p align="center">
    <strong>Front and back end Logging for Next.js Apps</strong>
    <br/>
    <div> Track events, debug issues, and keep an eye on performance all in one place! Inspired by other loggers, you can output to either file or console, or both
    using Newline delimited JSON (<a href="https://github.com/ndjson/ndjson-spec">https://github.com/ndjson/ndjson-spec</a>) or a more readable and stylized format for direct viewing. Output with color as well.</div>
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
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
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
I was looking for an easy-to-use file logger for my Next.js apps, suitable for both development and production, without the need to deploy to Vercel. I tried several popular solutions, but none of them worked for my use case, so of course I had to roll my own.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
<ul>
  <li>NextJS v14+</li>
  <li>Using the app router</li>
  <li>TypeScript</li>
</ul>

### Installation

* npm
  ```sh
  npm i log-2-route
  ```
* yarn
  ```sh
  yarn i log-2-route
  ```
Create a new route (<code>/app/logger/route.ts</code>) using this code. You can also find it in the repossitory under the <code>/route</code> directory.

```typescript
import { LogReceiver, altChalk } from "log-2-route";
import { promises as fs } from "fs";

type ResJsonType = { logData: string; error?: string };

const configFilePath = process.cwd();
let configFileContentStr: string;

async function loadConfig() {
  try {
    configFileContentStr = await fs.readFile(`${configFilePath}/ltr.config.json`, "utf-8");
    return JSON.parse(configFileContentStr);
  } catch (error) {
    console.error(altChalk.red(`Failed to read config file: ${(error as Error).message}`));
    throw new Error("Configuration file read error");
  }
}

const configFileContentJson = await loadConfig();

export async function POST(req: Request): Promise<Response> {
  try {
    const res = await LogReceiver(req);
    const resJson: ResJsonType = await res.json();

    if (resJson.error) {
      console.error(altChalk.red(resJson.error));
      return new Response(resJson.error, { status: 400 });
    } else {
      await fs.appendFile(`${configFilePath}/${configFileContentJson.logFile.fileName}`, resJson.logData);
      return new Response("Log data appended successfully", { status: 200 });
    }
  } catch (error) {
    console.error(altChalk.red(`Failed to process request: ${(error as Error).message}`));
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  return new Response(configFileContentStr, { status: 200 });
}

```





<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Nathan Schneider - nlschneider@gmail.com

GitHub: [[https://github.com/nathanlschneider/log-2-route](https://github.com/nathanlschneider/log-2-route)]<br/>
NPM:    [[https://github.com/nathanlschneider/log-2-route](https://github.com/nathanlschneider/log-2-route)]<br/>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
