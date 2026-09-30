/**
 * Recovers a clean FastAPI route name from a default-generated operationId.
 *
 * FastAPI's default operationId is `re.sub(r'\W','_', name + path) + '_' + method`.
 * Since `name` is a valid identifier, the suffix `re.sub(r'\W','_', path) + '_' + method`
 * can be stripped to recover `name`. Idempotent on already-clean ids.
 *
 * The backend now sets `generate_unique_id_function`, so operationIds ship clean
 * and this is a no-op in practice — it stays as a regression guard.
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

type SchemaObject = {
    type?: unknown;
    enum?: unknown[];
    items?: SchemaObject;
    anyOf?: SchemaObject[];
    properties?: Record<string, SchemaObject>;
    [key: string]: unknown;
};

type OpenApiSpec = {
    paths: Record<
        string,
        Record<
            string,
            {
                operationId?: string;
                parameters?: { name: string; schema?: SchemaObject }[];
            }
        >
    >;
    components?: { schemas?: Record<string, SchemaObject> };
};

const INLINE_ENUM_NAMES = {
    feed_content_types: 'FeedContentTypeEnum',
    comment_content_types: 'FeedCommentContentTypeEnum',
    article_content_types: 'FeedArticleContentTypeEnum',
    article_categories: 'FeedArticleCategoryEnum',
    collection_content_types: 'FeedCollectionContentTypeEnum',
    review_content_types: 'FeedReviewContentTypeEnum',
    recommended: 'ReviewRecommendedEnum',
    comment_type: 'CommentTypeEnum',
};

function refInlineEnum(
    schema: SchemaObject,
    ref: string,
    found: SchemaObject[],
): SchemaObject {
    if (Array.isArray(schema.enum)) {
        const { type, enum: values, ...rest } = schema;
        found.push({ type, enum: values });
        return { $ref: ref, ...rest };
    }

    if (schema.items) {
        return { ...schema, items: refInlineEnum(schema.items, ref, found) };
    }

    if (schema.anyOf) {
        return {
            ...schema,
            anyOf: schema.anyOf.map((member) =>
                refInlineEnum(member, ref, found),
            ),
        };
    }

    return schema;
}

/** Moves each named inline enum into a sorted, named `components.schemas` entry (mutates `spec`); throws on any mismatch. */
export function hoistInlineEnums<T extends OpenApiSpec>(
    spec: T,
    names: Record<string, string>,
): T {
    const schemas = spec.components?.schemas;
    if (!schemas) {
        throw new Error('hoistInlineEnums: spec has no components.schemas');
    }
    const hoisted: Record<string, SchemaObject> = {};

    for (const [property, name] of Object.entries(names)) {
        if (name in schemas) {
            throw new Error(`hoistInlineEnums: ${name} already exists`);
        }

        const ref = `#/components/schemas/${name}`;
        const found: SchemaObject[] = [];

        for (const schema of Object.values(schemas)) {
            const target = schema.properties?.[property];

            if (schema.properties && target) {
                schema.properties[property] = refInlineEnum(target, ref, found);
            }
        }

        for (const methods of Object.values(spec.paths)) {
            for (const op of Object.values(methods)) {
                for (const parameter of op?.parameters ?? []) {
                    if (parameter.name === property && parameter.schema) {
                        parameter.schema = refInlineEnum(
                            parameter.schema,
                            ref,
                            found,
                        );
                    }
                }
            }
        }

        const [first, ...others] = found.map((enumSchema) =>
            JSON.stringify(enumSchema),
        );

        if (first === undefined) {
            throw new Error(`hoistInlineEnums: no inline enum for ${property}`);
        }

        if (others.some((other) => other !== first)) {
            throw new Error(`hoistInlineEnums: ${property} enums differ`);
        }

        hoisted[name] = { ...found[0], title: name };
    }

    const entries = Object.entries(schemas);

    for (const [name, schema] of Object.entries(hoisted)) {
        const index = entries.findIndex(([key]) => key > name);
        entries.splice(index === -1 ? entries.length : index, 0, [
            name,
            schema,
        ]);
    }

    for (const key of Object.keys(schemas)) delete schemas[key];
    Object.assign(schemas, Object.fromEntries(entries));

    return spec;
}

const DISCRIMINATOR_PROPERTY = 'data_type';

const SCHEMA_REF_PREFIX = '#/components/schemas/';

function discriminatorMapping(
    members: SchemaObject[],
    schemas: Record<string, SchemaObject>,
    property: string,
): Record<string, string> | undefined {
    const mapping: Record<string, string> = {};

    for (const member of members) {
        if (member.type === 'null') continue;

        const ref = member.$ref;
        if (typeof ref !== 'string' || !ref.startsWith(SCHEMA_REF_PREFIX)) {
            return undefined;
        }

        const target = schemas[ref.slice(SCHEMA_REF_PREFIX.length)];
        const value = target?.properties?.[property]?.const;
        const required = Array.isArray(target?.required) ? target.required : [];

        if (typeof value !== 'string' || !required.includes(property)) {
            return undefined;
        }
        if (value in mapping) return undefined;

        mapping[value] = ref;
    }

    return Object.keys(mapping).length > 1 ? mapping : undefined;
}

/** Marks every anyOf/oneOf whose members all require a distinct `const` of `property` as discriminated (mutates `spec`). */
export function addDiscriminators<
    T extends Pick<OpenApiSpec, 'components'> & { paths: unknown },
>(spec: T, property: string): T {
    const schemas = spec.components?.schemas ?? {};

    const visit = (node: unknown) => {
        if (Array.isArray(node)) {
            for (const child of node) visit(child);
            return;
        }
        if (!node || typeof node !== 'object') return;

        const schema = node as SchemaObject;

        for (const key of ['anyOf', 'oneOf'] as const) {
            const members = schema[key];
            if (!Array.isArray(members) || schema.discriminator) continue;

            const mapping = discriminatorMapping(members, schemas, property);
            if (mapping) {
                schema.discriminator = { propertyName: property, mapping };
            }
        }

        for (const child of Object.values(schema)) visit(child);
    };

    visit(spec.paths);
    visit(schemas);

    return spec;
}

/**
 * Rewrites every operationId to its clean route name, names the repeated
 * inline enums and discriminates the `data_type` unions. Mutates and returns `spec`.
 */
export function transformSpec<T extends OpenApiSpec>(spec: T): T {
    for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, op] of Object.entries(methods)) {
            if (op && typeof op === 'object' && op.operationId) {
                op.operationId = recoverOperationId(
                    op.operationId,
                    path,
                    method,
                );
            }
        }
    }

    hoistInlineEnums(spec, INLINE_ENUM_NAMES);

    return addDiscriminators(spec, DISCRIMINATOR_PROPERTY);
}
