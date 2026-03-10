import { UserRoleEnum } from '@hikka/client';

export const USER_ROLE: Record<UserRoleEnum, { label: string; color: string }> =
    {
        admin: {
            label: 'Адміністратор',
            color: '#468F40',
        },
        moderator: {
            label: 'Модератор',
            color: '#40518F',
        },
        user: {
            label: 'Користувач',
            color: '#000',
        },
        not_activated: {
            label: 'Неактивований',
            color: '#000',
        },
        deleted: {
            label: 'Видалений',
            color: '#000',
        },
        banned: {
            label: 'Забанений',
            color: '#000',
        },
    };

