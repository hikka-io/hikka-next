/**
 * Base user response
 */
export interface UserResponse {
    reference: string;
    updated: number | null;
    created: number;
    description: string | null;
    username: string | null;
    cover: string | null;
    active: boolean;
    avatar: string;
    role: string;
}

/**
 * User response with followed status
 */
export interface UserResponseFollowed extends UserResponse {
    is_followed: boolean;
}

/**
 * User response with email
 */
export interface UserWithEmailResponse extends UserResponse {
    email: string | null;
}

/**
 * Required query search parameters
 */
export interface QuerySearchRequiredArgs {
    query: string;
}

/**
 * User activity response
 */
export interface ActivityResponse {
    timestamp: number;
    actions: number;
}

/**
 * User read/watch export response (base structure)
 */
export interface UserExportEntryBase {
    note: string | null;
    hikka_slug: string;
    created: number;
    updated: number;
    mal_id: number;
    status: string;
    score: number;
}

/**
 * User watch export response
 */
export interface UserExportWatchResponse extends UserExportEntryBase {
    rewatches: number;
    episodes: number;
}

/**
 * User read export response
 */
export interface UserExportReadResponse extends UserExportEntryBase {
    chapters: number;
    rereads: number;
    volumes: number;
}

/**
 * User export response
 */
export interface UserExportResponse {
    anime: UserExportWatchResponse[];
    manga: UserExportReadResponse[];
    novel: UserExportReadResponse[];
    created: number;
    updated: number;
}
