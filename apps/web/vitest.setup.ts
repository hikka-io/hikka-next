// jsdom lacks object-URL APIs used by the upload placeholder pipeline.
if (typeof URL.createObjectURL !== 'function') {
    URL.createObjectURL = () => 'blob:mock';
}
if (typeof URL.revokeObjectURL !== 'function') {
    URL.revokeObjectURL = () => {};
}

// jsdom lacks ResizeObserver, which @dnd-kit/dom references at import time.
if (typeof globalThis.ResizeObserver !== 'function') {
    globalThis.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
