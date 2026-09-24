import BxBxlGithub from '@/components/icons/bx/BxBxlGithub';
import BxBxlMastodon from '@/components/icons/bx/BxBxlMastodon';
import BxBxlTelegram from '@/components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '@/components/icons/bx/BxBxsDonateHeart';
import MaterialSymbolsForumOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsForumOutlineRounded';
import PhTipJarFill from '@/components/icons/ph/PhTipJarFill';

export const EXTERNAL_LINKS = {
    telegramChannel: {
        slug: 'telegram',
        title: 'Telegram',
        href: 'https://t.me/hikka_io',
        icon: BxBxlTelegram,
    },
    telegramChat: {
        slug: 'telegram-chat',
        title: 'Telegram-чат',
        href: 'https://t.me/hikka_io_chat',
        icon: MaterialSymbolsForumOutlineRounded,
    },
    github: {
        slug: 'github',
        title: 'GitHub',
        href: 'https://github.com/hikka-io',
        icon: BxBxlGithub,
    },
    mastodon: {
        slug: 'mastodon',
        title: 'Mastodon',
        href: 'https://social.noleron.com/@hikka',
        icon: BxBxlMastodon,
    },
    donatello: {
        slug: 'donatello',
        title: 'Donatello',
        href: 'https://donatello.to/hikka.io',
        icon: BxBxsDonateHeart,
    },
    monobank: {
        slug: 'monobank',
        title: 'Монобанка',
        href: 'https://send.monobank.ua/jar/UejmZHk4B',
        icon: PhTipJarFill,
    },
} as const;

export const SOCIAL_LINKS = [
    EXTERNAL_LINKS.github,
    EXTERNAL_LINKS.telegramChannel,
    EXTERNAL_LINKS.mastodon,
] as const;

export const DONATION_LINKS = [
    EXTERNAL_LINKS.donatello,
    EXTERNAL_LINKS.monobank,
] as const;

export const COMMUNITY_LINKS = [
    EXTERNAL_LINKS.telegramChannel,
    EXTERNAL_LINKS.telegramChat,
] as const;

export const ABOUT_LINKS = [
    EXTERNAL_LINKS.telegramChannel,
    EXTERNAL_LINKS.telegramChat,
    EXTERNAL_LINKS.donatello,
    EXTERNAL_LINKS.monobank,
    EXTERNAL_LINKS.github,
    EXTERNAL_LINKS.mastodon,
] as const;
