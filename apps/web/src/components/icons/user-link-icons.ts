import type { ComponentType } from 'react';

import { UserLinkIconEnum } from '@hikka/api';

import MaterialSymbolsLinkRounded from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import SimpleIconsActivitypub from '@/components/icons/simple-icons/SimpleIconsActivitypub';
import SimpleIconsBluesky from '@/components/icons/simple-icons/SimpleIconsBluesky';
import SimpleIconsDiscord from '@/components/icons/simple-icons/SimpleIconsDiscord';
import SimpleIconsGithub from '@/components/icons/simple-icons/SimpleIconsGithub';
import SimpleIconsInstagram from '@/components/icons/simple-icons/SimpleIconsInstagram';
import SimpleIconsSteam from '@/components/icons/simple-icons/SimpleIconsSteam';
import SimpleIconsTelegram from '@/components/icons/simple-icons/SimpleIconsTelegram';
import SimpleIconsThreads from '@/components/icons/simple-icons/SimpleIconsThreads';
import SimpleIconsX from '@/components/icons/simple-icons/SimpleIconsX';

export const USER_LINK_ICONS = {
    [UserLinkIconEnum.FEDIVERSE]: SimpleIconsActivitypub,
    [UserLinkIconEnum.INSTAGRAM]: SimpleIconsInstagram,
    [UserLinkIconEnum.TELEGRAM]: SimpleIconsTelegram,
    [UserLinkIconEnum.THREADS]: SimpleIconsThreads,
    [UserLinkIconEnum.TWITTER]: SimpleIconsX,
    [UserLinkIconEnum.DISCORD]: SimpleIconsDiscord,
    [UserLinkIconEnum.BLUESKY]: SimpleIconsBluesky,
    [UserLinkIconEnum.GITHUB]: SimpleIconsGithub,
    [UserLinkIconEnum.CUSTOM]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.STEAM]: SimpleIconsSteam,
} as const satisfies Record<
    UserLinkIconEnum,
    ComponentType<{ className?: string }>
>;
