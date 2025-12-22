/**
 * Artifact response
 */
export interface ArtifactResponse<TData = Record<string, unknown>> {
    created: number;
    updated: number;
    private: boolean;
    data: TData;
    name: string;
}

/**
 * Args for updating artifact privacy
 */
export interface ArtifactPrivacyArgs {
    private: boolean;
}
