# n8n-nodes-softime

n8n community node for [Softime](https://softime.app), the time tracking app. It lets you use Softime in n8n workflows and as a tool of the n8n AI Agent node (`usableAsTool`).

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Compatibility](#compatibility) · [Development](#development)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and install the package `n8n-nodes-softime`:

1. In n8n, go to **Settings → Community Nodes → Install**.
2. Enter `n8n-nodes-softime` and accept the risks notice.

For self-hosted n8n you can also run `npm install n8n-nodes-softime` in the n8n custom nodes folder (`~/.n8n/nodes`).

To use the node as an AI Agent tool in self-hosted n8n, set `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true`.

## Credentials

Create a **Softime API** credential with:

| Field | Description |
| --- | --- |
| API Token | Personal API token, created in the Softime workspace page (**Workspace → API tokens**, owner/admin only). Sent as `Authorization: Bearer <token>`. |
| Base URL | Defaults to `https://api.softime.app`. Change it to test against staging (`https://api.staging.softime.softspring.cloud`). |

The token needs the permissions of the operations you use: `time:read` / `time:write` for timer and time entries, `catalog:read` / `catalog:write` for projects and clients. The **Test** button calls `GET /api/v1/timer/current`, so it requires a token with `time:read`.

Errors: an invalid or expired token (401) and rate limiting (429) produce explicit error messages; 403 explains the likely causes (missing scope, tokens disabled, inactive subscription).

## Operations

| Resource | Operations |
| --- | --- |
| Timer | Start, Stop, Get Active |
| Time Entry | Create, Get, Get Many (filters: date from/to, project), Update, Delete |
| Project | Get Many, Create |
| Client | Get Many |

Get Many operations support *Return All* and *Limit*. Only operations already exposed by the Softime REST API (`/api/v1`) are included; tasks, tags, reports and updating/archiving projects or clients are not covered yet.

## Compatibility

Built with `@n8n/node-cli` 0.56.4 and `n8n-workflow` 2.47.2 (n8n 2.x). Tested only at build level: lint, build and loading of the compiled node and credential classes. It has not yet been run inside a full n8n instance nor against the real Softime API.

## Development

```sh
npm install
npm run lint
npm run build
npm run dev   # starts a local n8n with the node loaded
```

Releases are published to npm from GitHub Actions with provenance (`.github/workflows/publish.yml`) when a version tag is pushed.

## License

[MIT](LICENSE)
