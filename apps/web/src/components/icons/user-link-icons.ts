import type { ComponentType } from 'react';

import { UserLinkIconEnum } from '@hikka/api';

import MaterialSymbolsLinkRounded from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import SimpleIconsBluesky from '@/components/icons/simple-icons/SimpleIconsBluesky';
import SimpleIconsChessdotcom from '@/components/icons/simple-icons/SimpleIconsChessdotcom';
import SimpleIconsDiscord from '@/components/icons/simple-icons/SimpleIconsDiscord';
import SimpleIconsGithub from '@/components/icons/simple-icons/SimpleIconsGithub';
import SimpleIconsInstagram from '@/components/icons/simple-icons/SimpleIconsInstagram';
import SimpleIconsReddit from '@/components/icons/simple-icons/SimpleIconsReddit';
import SimpleIconsSteam from '@/components/icons/simple-icons/SimpleIconsSteam';
import SimpleIconsTelegram from '@/components/icons/simple-icons/SimpleIconsTelegram';
import SimpleIconsThreads from '@/components/icons/simple-icons/SimpleIconsThreads';
import SimpleIconsX from '@/components/icons/simple-icons/SimpleIconsX';
import SimpleIconsYoutube from '@/components/icons/simple-icons/SimpleIconsYoutube';

export const USER_LINK_ICONS = {
    [UserLinkIconEnum.INSTAGRAM]: SimpleIconsInstagram,
    [UserLinkIconEnum.TELEGRAM]: SimpleIconsTelegram,
    [UserLinkIconEnum.THREADS]: SimpleIconsThreads,
    [UserLinkIconEnum.TWITTER]: SimpleIconsX,
    [UserLinkIconEnum.DISCORD]: SimpleIconsDiscord,
    [UserLinkIconEnum.BLUESKY]: SimpleIconsBluesky,
    [UserLinkIconEnum.GITHUB]: SimpleIconsGithub,
    [UserLinkIconEnum.CUSTOM]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.STEAM]: SimpleIconsSteam,
    [UserLinkIconEnum.YOUTUBE]: SimpleIconsYoutube,
    [UserLinkIconEnum.REDDIT]: SimpleIconsReddit,
    [UserLinkIconEnum.CHESS]: SimpleIconsChessdotcom,
    [UserLinkIconEnum.MANGAINUA]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.MANGALIST]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.ANITUBE]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.DGMANGA]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.MIKAI]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.ZENKO]: MaterialSymbolsLinkRounded,
} as const satisfies Record<
    UserLinkIconEnum,
    ComponentType<{ className?: string }>
>;
