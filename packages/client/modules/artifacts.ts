import { ArtifactPrivacyArgs, ArtifactResponse, BaseRequestOptionsArgs } from '../types';
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
     * Update artifact privacy
     */
    public async updateArtifactPrivacy(
        name: string,
        args: ArtifactPrivacyArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<void> {
        return this.client.post<void>(
            `/artifacts/${name}/privacy`,
            args,
            options,
        );
    }
}

