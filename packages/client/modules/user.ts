import {
    ActivityResponse,
    BaseRequestOptionsArgs,
    QuerySearchRequiredArgs,
    UserResponse,
    UserUI,
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

    /**
     * Get user UI config by username
     */
    public async getCurrentUserUI(
        options?: BaseRequestOptionsArgs,
    ): Promise<UserUI> {
        return this.client.get<UserUI>(`/user/me/ui`, options);
    }

    /**
     * Get user UI config by username
     */
    public async getUserUI(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserUI> {
        return this.client.get<UserUI>(`/user/${username}/ui`, options);
    }
}
