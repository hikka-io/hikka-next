import {
    ArtifactPrivacyArgs,
    ArtifactPrivacyResponse,
    ArtifactResponse,
    BaseRequestOptionsArgs,
} from '../types';
import { BaseModule } from './base';

export class ArtifactsModule extends BaseModule {
    /**
     * Get artifact by username and name
     */
    public async getArtifact<TData = Record<string, unknown>>(
        username: string,
        name: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArtifactResponse<TData>> {
        return this.client.get<ArtifactResponse<TData>>(
            `/artifacts/${username}/${name}`,
            options,
        );
    }

    /**
     * Get artifact privacy status
     */
    public async getArtifactPrivacy(
        name: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArtifactPrivacyResponse> {
        return this.client.get<ArtifactPrivacyResponse>(
            `/artifacts/${name}/privacy`,
            options,
        );
    }

    /**
     * Update artifact privacy
     */
    public async updateArtifactPrivacy(
        name: string,
        args: ArtifactPrivacyArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArtifactPrivacyResponse> {
        return this.client.post<ArtifactPrivacyResponse>(
            `/artifacts/${name}/privacy`,
            args,
            options,
        );
    }

    /**
     * Get user artifact privacy status
     */
    public async getUserArtifactPrivacy(
        username: string,
        name: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArtifactPrivacyResponse> {
        return this.client.get<ArtifactPrivacyResponse>(
            `/artifacts/${username}/${name}/privacy`,
            options,
        );
    }
}
