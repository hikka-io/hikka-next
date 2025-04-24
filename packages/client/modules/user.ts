import {
    ActivityResponse,
    QuerySearchRequiredArgs,
    UserResponse,
} from '../types';
import { BaseModule } from './base';

export class UserModule extends BaseModule {
    /**
     * Get current user profile
     */
    public async getMe(): Promise<UserResponse> {
        return this.client.get<UserResponse>('/user/me');
    }

    /**
     * Get user profile by username
     */
    public async getByUsername(username: string): Promise<UserResponse> {
        return this.client.get<UserResponse>(`/user/${username}`);
    }

    /**
     * Search for users
     */
    public async search(
        args: QuerySearchRequiredArgs,
    ): Promise<UserResponse[]> {
        return this.client.post<UserResponse[]>('/user/list', args);
    }

    /**
     * Get user activity
     */
    public async getActivity(username: string): Promise<ActivityResponse[]> {
        return this.client.get<ActivityResponse[]>(
            `/user/${username}/activity`,
        );
    }
}
