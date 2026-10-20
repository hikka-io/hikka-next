import { useOpenLink } from '@/components/markdown';
import { siteUrl } from '@/utils/site-origin';

export const useOpenSitePath = () => {
    const openLink = useOpenLink();

    return (path: string) => openLink(siteUrl(path));
};
