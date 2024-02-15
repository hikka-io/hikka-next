import SnackbarUtils from '@/utils/snackbar-utils';
import config from '@/services/api/config';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import { fetchRequest } from '@/services/api/fetchRequest';

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
    return fetchRequest<Response>({
        path: `/auth/login`,
        method: 'post',
        params: {
            email: params.email,
            password: params.password,
        },
        captcha: params.captcha,
        enqueueError: true,
    });
}
