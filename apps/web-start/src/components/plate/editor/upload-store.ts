import type { PlateEditor } from 'platejs/react';

export interface UploadEntry {
    file: File;
    abort: AbortController;
}

// Slate nodes must be JSON-serializable, so the live File + AbortController for
// each in-flight upload live here, keyed by editor then placeholder id. The
// WeakMap lets the per-editor map GC when the editor is discarded.
const stores = new WeakMap<object, Map<string, UploadEntry>>();

function storeFor(editor: PlateEditor): Map<string, UploadEntry> {
    let map = stores.get(editor);
    if (!map) {
        map = new Map();
        stores.set(editor, map);
    }
    return map;
}

export function setUpload(
    editor: PlateEditor,
    id: string,
    entry: UploadEntry,
): void {
    storeFor(editor).set(id, entry);
}

export function getUpload(
    editor: PlateEditor,
    id: string,
): UploadEntry | undefined {
    return storeFor(editor).get(id);
}

export function deleteUpload(editor: PlateEditor, id: string): void {
    storeFor(editor).delete(id);
}
