import config from '@/utils/api/config';
import getApiErrorMessage from "@/utils/getApiErrorMessage";
import SnackbarUtils from "@/utils/SnackbarUtils";

export interface Response {
    description: string;
}

export default async function req({
                                      username,
    secret,
}: {
    username: string;
    secret: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/settings/username', {
        method: 'put',
        body: JSON.stringify({ username }),
        ...config.config,
        headers: {
            ...config.config.headers,
            auth: secret || '',
        },
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            const error: Hikka.Error = await res.json();
            const errorMessage = getApiErrorMessage(error);

            errorMessage && SnackbarUtils.error(errorMessage);
            throw error;
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}