import type { UserRoleEnum } from '@hikka/api';

export const USER_ROLE: Record<UserRoleEnum, { label: string }> = {
    admin: {
        label: 'Адміністратор',
    },
    moderator: {
        label: 'Модератор',
    },
    user: {
        label: 'Користувач',
    },
    not_activated: {
        label: 'Неактивований',
    },
    deleted: {
        label: 'Видалений',
    },
    banned: {
        label: 'Забанений',
    },
};
