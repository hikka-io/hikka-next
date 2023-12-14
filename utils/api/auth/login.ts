import SnackbarUtils from '@/utils/SnackbarUtils';
import config from '@/utils/api/config';
import getApiErrorMessage from '@/utils/getApiErrorMessage';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export default async function req(params: {
    email: string;
    password: string;
    captcha: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/auth/login', {
        method: 'post',
        body: JSON.stringify({
            email: params.email,
            password: params.password,
        }),
        ...config.config,
        headers: {
            ...config.config.headers,
            Captcha: params.captcha,
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
