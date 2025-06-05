import {
    ActivityResponse,
    BaseRequestOptionsArgs,
    QuerySearchRequiredArgs,
    UserResponse,
} from '../types';
import { BaseModule } from './base';

export class UserModule extends BaseModule {
    /**
     * Get current user profile details
     */
    public async getCurrentUser(
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.get<UserResponse>('/user/me', options);
    }

    /**
     * Get user details by username
     */
    public async getUserByUsername(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.get<UserResponse>(`/user/${username}`, options);
    }

    /**
     * Search for users with filtering criteria
     */
    public async searchUsers(
        args: QuerySearchRequiredArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse[]> {
        return this.client.post<UserResponse[]>('/user/list', args, options);
    }

    /**
     * Get activity for a user
     */
    public async getUserActivity(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ActivityResponse[]> {
        return this.client.get<ActivityResponse[]>(
            `/user/${username}/activity`,
            options,
        );
    }
}
