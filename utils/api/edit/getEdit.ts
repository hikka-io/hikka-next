import config from '@/utils/api/config';

export interface Response extends Hikka.Edit {

}

export default async function req({
    edit_id,
}: {
    edit_id: number;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/edit/' + edit_id,
        {
            method: 'get',
            ...config.config,
        },
    );

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
