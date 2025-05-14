CINE 3184 final project source code
====

This repository contains source code for the final project.

# Installation

> [!NOTE]
> To run the code, you might need to install the following packages:
> 
> * [Node.js](https://github.com/nodejs/node) (project source code: https://github.com/nodejs/node, download: https://nodejs.org/en/download)


After installing Node.js, you can run the following command to install the required packages:

```bash
npm install
```

# Usage

As Service Worker and webXR is being used within the project, they need to be served within [Secure Context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts), to do this, you can either test within your localhost, or, try this project: https://github.com/mattrossman/hmd-link (you can get more information here, from a-frame's description: https://github.com/aframevr/aframe?tab=readme-ov-file#local-development)

To start with the project, you can run the following command:

```bash
npm run start:https
```

