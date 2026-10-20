import { SITE_ORIGIN, useOpenLink } from '@/components/markdown';

export const useOpenSitePath = () => {
    const openLink = useOpenLink();

    return (path: string) => openLink(`${SITE_ORIGIN}${path}`);
};
