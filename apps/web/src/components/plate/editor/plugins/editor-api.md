# Editor API bridge

When an editor is configured with an `editorId`, extensions can communicate with
it through `window.postMessage`.

```ts
window.postMessage(
    {
        source: 'hikka-editor-api',
        type: 'request',
        requestId: crypto.randomUUID(),
        editorId: 'article-body',
        command: 'get',
    },
    '*',
);
```

The editor responds with the same `requestId`:

```ts
{
    source: 'hikka-editor-api',
    type: 'response',
    requestId: '...',
    editorId: 'article-body',
    ok: true,
    value: [...],
}
```

Supported commands are `get`, `set`, and `insert`. `set` replaces the
whole Plate value; `insert` inserts a Plate fragment at the current selection.
Both commands receive their content in `value`.

Requests for another editor are ignored. Invalid commands and values return
`ok: false` with an `error.code` and `error.message`.
