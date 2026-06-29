// jsdom lacks object-URL APIs used by the upload placeholder pipeline.
if (typeof URL.createObjectURL !== 'function') {
    URL.createObjectURL = () => 'blob:mock';
}
if (typeof URL.revokeObjectURL !== 'function') {
    URL.revokeObjectURL = () => {};
}
