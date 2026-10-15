import type { ComponentType, CSSProperties, SVGProps } from 'react';

import { UserLinkIconEnum } from '@hikka/api';

import CustomUserLinkAnitube from '@/components/icons/custom/CustomUserLinkAnitube';
import CustomUserLinkDgManga from '@/components/icons/custom/CustomUserLinkDgManga';
import CustomUserLinkMangaInUa from '@/components/icons/custom/CustomUserLinkMangaInUa';
import CustomUserLinkMangaList from '@/components/icons/custom/CustomUserLinkMangaList';
import CustomUserLinkMikai from '@/components/icons/custom/CustomUserLinkMikai';
import CustomUserLinkZenko from '@/components/icons/custom/CustomUserLinkZenko';
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

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

function withBrandColor(Icon: IconComponent, color: string) {
    return function BrandIcon({
        className,
        style,
        ...props
    }: SVGProps<SVGSVGElement>) {
        return (
            <Icon
                {...props}
                className={`transition-colors [:is(a,button):is(:hover,:focus-visible)_&]:text-(--brand-color) ${className ?? ''}`}
                style={{ ...style, '--brand-color': color } as CSSProperties}
            />
        );
    };
}

function withHoverColor(Icon: IconComponent) {
    return function HoverColorIcon({
        className,
        ...props
    }: SVGProps<SVGSVGElement>) {
        return (
            <Icon
                {...props}
                className={`grayscale transition [:is(a,button):is(:hover,:focus-visible)_&]:grayscale-0 ${className ?? ''}`}
            />
        );
    };
}

const AnitubeIcon = withHoverColor(CustomUserLinkAnitube);
const DgMangaIcon = withHoverColor(CustomUserLinkDgManga);
const MangaInUaIcon = withHoverColor(CustomUserLinkMangaInUa);
const MangaListIcon = withHoverColor(CustomUserLinkMangaList);
const MikaiIcon = withHoverColor(CustomUserLinkMikai);
const ZenkoIcon = withHoverColor(CustomUserLinkZenko);
const InstagramIcon = withBrandColor(SimpleIconsInstagram, '#e4405f');
const TelegramIcon = withBrandColor(SimpleIconsTelegram, '#26a5e4');
const DiscordIcon = withBrandColor(SimpleIconsDiscord, '#5865f2');
const BlueskyIcon = withBrandColor(SimpleIconsBluesky, '#0285ff');
const YoutubeIcon = withBrandColor(SimpleIconsYoutube, '#ff0000');
const RedditIcon = withBrandColor(SimpleIconsReddit, '#ff4500');
const ChessIcon = withBrandColor(SimpleIconsChessdotcom, '#81b64c');

export const USER_LINK_ICONS = {
    [UserLinkIconEnum.INSTAGRAM]: InstagramIcon,
    [UserLinkIconEnum.TELEGRAM]: TelegramIcon,
    [UserLinkIconEnum.THREADS]: SimpleIconsThreads,
    [UserLinkIconEnum.TWITTER]: SimpleIconsX,
    [UserLinkIconEnum.DISCORD]: DiscordIcon,
    [UserLinkIconEnum.BLUESKY]: BlueskyIcon,
    [UserLinkIconEnum.GITHUB]: SimpleIconsGithub,
    [UserLinkIconEnum.CUSTOM]: MaterialSymbolsLinkRounded,
    [UserLinkIconEnum.STEAM]: SimpleIconsSteam,
    [UserLinkIconEnum.YOUTUBE]: YoutubeIcon,
    [UserLinkIconEnum.REDDIT]: RedditIcon,
    [UserLinkIconEnum.CHESS]: ChessIcon,
    [UserLinkIconEnum.MANGAINUA]: MangaInUaIcon,
    [UserLinkIconEnum.MANGALIST]: MangaListIcon,
    [UserLinkIconEnum.ANITUBE]: AnitubeIcon,
    [UserLinkIconEnum.DGMANGA]: DgMangaIcon,
    [UserLinkIconEnum.MIKAI]: MikaiIcon,
    [UserLinkIconEnum.ZENKO]: ZenkoIcon,
} as const satisfies Record<
    UserLinkIconEnum,
    ComponentType<{ className?: string }>
>;
