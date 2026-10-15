import { UserLinkIconEnum } from '@hikka/api';

export const USER_LINK_ICON = {
    [UserLinkIconEnum.INSTAGRAM]: { label: 'Instagram' },
    [UserLinkIconEnum.TELEGRAM]: { label: 'Telegram' },
    [UserLinkIconEnum.THREADS]: { label: 'Threads' },
    [UserLinkIconEnum.TWITTER]: { label: 'X' },
    [UserLinkIconEnum.DISCORD]: { label: 'Discord' },
    [UserLinkIconEnum.BLUESKY]: { label: 'Bluesky' },
    [UserLinkIconEnum.GITHUB]: { label: 'GitHub' },
    [UserLinkIconEnum.CUSTOM]: { label: 'Посилання' },
    [UserLinkIconEnum.STEAM]: { label: 'Steam' },
} as const satisfies Record<UserLinkIconEnum, { label: string }>;
