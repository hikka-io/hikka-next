import config from '@/services/api/config';
import { fetchRequest } from '@/services/api/fetchRequest';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import SnackbarUtils from '@/utils/snackbar-utils';

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
