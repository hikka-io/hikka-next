/**
 * Recovers a clean FastAPI route name from a default-generated operationId.
 *
 * FastAPI's default operationId is `re.sub(r'\W','_', name + path) + '_' + method`.
 * Since `name` is a valid identifier, the suffix `re.sub(r'\W','_', path) + '_' + method`
 * can be stripped to recover `name`. Idempotent on already-clean ids.
 */
export function recoverOperationId(
    operationId: string,
    path: string,
    method: string,
): string {
    const suffix = `${path.replace(/\W/g, '_')}_${method.toLowerCase()}`;
    return operationId.endsWith(suffix)
        ? operationId.slice(0, -suffix.length)
        : operationId;
}

type OpenApiSpec = {
    paths: Record<string, Record<string, { operationId?: string }>>;
};

/** Rewrites every operationId in place to its clean route name. Mutates and returns `spec`. */
export function transformSpec<T extends OpenApiSpec>(spec: T): T {
    for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, op] of Object.entries(methods)) {
            if (op && typeof op === 'object' && op.operationId) {
                op.operationId = recoverOperationId(op.operationId, path, method);
            }
        }
    }
    return spec;
}
