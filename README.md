# n8n-nodes-tgt

[![npm](https://img.shields.io/npm/v/n8n-nodes-tgt.svg)](https://www.npmjs.com/package/n8n-nodes-tgt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Community node for [n8n](https://n8n.io/) to work with **TGT** (transport card, api.tgt72.ru): check balance and use credentials as an account.

## Nodes

### Get Balance

Returns the balance for a transport card. Uses the **Account** (credential) where you store the card number; no need to enter it in each workflow.

- **Credential:** Transport Card — only field: **Card Number**
- **Output:** API response (e.g. balance and other fields from api.tgt72.ru)

API: `GET https://api.tgt72.ru/api/v5/balance/?card=...&hash=...`
Hash: MD5 of `dd.MM.yyyy.cardNumber` (current date in local timezone + card number).

## Installation

### From npm (for self-hosted n8n)

```bash
npm install n8n-nodes-tgt
```

Then add the package to your n8n instance (e.g. via `N8N_COMMUNITY_PACKAGES` or [Loading community nodes](https://docs.n8n.io/integrations/community-nodes/)).

### From source

```bash
git clone https://github.com/YOUR_USERNAME/n8n-nodes-tgt.git
cd n8n-nodes-tgt
npm install
npm run build
```

Use the `dist` folder or link the project as a community package.

## Development

- **Node.js** 18+
- **npm**

```bash
# Install dependencies
npm install

# Build
npm run build

# Run n8n with this node (hot reload)
npm run dev
```

Then open http://localhost:5678. Create a **Transport Card** credential (Card Number) and use the **Get Balance** node with **Account** set to that credential.

### Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start n8n with node + watch    |
| `npm run build`| Build to `dist/`               |
| `npm run lint` | Run ESLint                     |
| `npm run lint:fix` | Fix lint issues            |

## Project structure

```
n8n-nodes-tgt/
├── credentials/
│   └── TransportCardApi.credentials.ts   # Transport Card (card number)
├── nodes/
│   └── Example/
│       ├── TgtDemo.node.ts               # TGT Demo node
│       ├── get_balance.node.ts           # TGT Balance node
│       ├── get_balance.node.json         # Codex for Get Balance
│       ├── TgtDemo.node.json             # Codex for demo node
│       ├── tgt.svg
│       └── tgt.dark.svg
├── package.json
├── tsconfig.json
└── README.md
```

## License

[MIT](LICENSE)
