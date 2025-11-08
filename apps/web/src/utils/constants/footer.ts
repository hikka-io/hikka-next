import BxBxlGithub from '@/components/icons/bx/BxBxlGithub';
import BxBxlTelegram from '@/components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '@/components/icons/bx/BxBxsDonateHeart';
import PhTipJarFill from '@/components/icons/ph/PhTipJarFill';

// Footer navigation constants
export const FOOTER_LINKS = {
    rules: {
        title: 'Правила',
        href: '/articles/pravyla-saytu-9bcf83',
    },
    owners: {
        title: 'Правовласникам',
        href: '/articles/pravovlasnykam-a76512',
    },
} as const;

export const DONATION_LINKS = [
    {
        title: 'Donatello',
        href: 'https://donatello.to/hikka.io',
        icon: BxBxsDonateHeart,
    },
    {
        title: 'Монобанка',
        href: 'https://send.monobank.ua/jar/UejmZHk4B',
        icon: PhTipJarFill,
    },
] as const;

export const SOCIAL_LINKS = [
    {
        title: 'Telegram',
        href: 'https://t.me/hikka_io',
        icon: BxBxlTelegram,
    },
    {
        title: 'GitHub',
        href: 'https://github.com/hikka-io',
        icon: BxBxlGithub,
    },
] as const;