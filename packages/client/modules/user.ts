import {
    ActivityResponse,
    QuerySearchRequiredArgs,
    UserResponse,
} from '../types';
import { BaseModule } from './base';

export class UserModule extends BaseModule {
    /**
     * Get current user profile details
     */
    public async getCurrentUser(): Promise<UserResponse> {
        return this.client.get<UserResponse>('/user/me');
    }

    /**
     * Get user details by username
     */
    public async getUserByUsername(username: string): Promise<UserResponse> {
        return this.client.get<UserResponse>(`/user/${username}`);
    }

    /**
     * Search for users with filtering criteria
     */
    public async searchUsers(
        args: QuerySearchRequiredArgs,
    ): Promise<UserResponse[]> {
        return this.client.post<UserResponse[]>('/user/list', args);
    }

    /**
     * Get activity for a user
     */
    public async getUserActivity(
        username: string,
    ): Promise<ActivityResponse[]> {
        return this.client.get<ActivityResponse[]>(
            `/user/${username}/activity`,
        );
    }
}
