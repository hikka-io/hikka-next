import { HikkaClient } from '../client';

/**
 * Base class for all API modules
 *
 * Naming conventions for methods:
 * - get[Resource]BySlug(slug) - Get a single resource by its slug
 * - get[Resource]ById(id) - Get a single resource by its ID or reference
 * - get[Resource]List() - Get a list of resources (usually paginated)
 * - search[Resource]s(args) - Search for resources with criteria
 * - create[Resource](args) - Create a new resource
 * - update[Resource](id/slug, args) - Update an existing resource
 * - delete[Resource](id/slug) - Delete a resource
 * - get[Resource][Relation](slug) - Get related resources
 */
export abstract class BaseModule {
    protected client: HikkaClient;

    constructor(client: HikkaClient) {
        this.client = client;
    }
}
