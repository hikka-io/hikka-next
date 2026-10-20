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
    [UserLinkIconEnum.YOUTUBE]: { label: 'YouTube' },
    [UserLinkIconEnum.REDDIT]: { label: 'Reddit' },
    [UserLinkIconEnum.CHESS]: { label: 'Chess.com' },
    [UserLinkIconEnum.MANGAINUA]: { label: 'Manga.in.ua' },
    [UserLinkIconEnum.MANGALIST]: { label: 'MangaList' },
    [UserLinkIconEnum.ANITUBE]: { label: 'AniTube' },
    [UserLinkIconEnum.DGMANGA]: { label: 'DGManga' },
    [UserLinkIconEnum.MIKAI]: { label: 'Mikai' },
    [UserLinkIconEnum.ZENKO]: { label: 'Zenko' },
} as const satisfies Record<UserLinkIconEnum, { label: string }>;
