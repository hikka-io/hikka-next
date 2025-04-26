import { QuerySearchRequiredArgs, UserResponse } from '@hikka/client';

import { QueryParams } from '@/client/useQuery';

export interface UseUserByUsernameParams extends QueryParams<UserResponse> {
    username: string;
}

export interface UseUserSearchParams {
    args: QuerySearchRequiredArgs;
}

export interface UseUserActivityParams {
    username: string;
}

// No parameters needed for useSession hook
export interface UseSessionParams {}
