import {
    Children,
    Fragment,
    type PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

import IconamoonSignDivisionSlashThin from '@/components/icons/iconamoon/IconamoonSignDivisionSlashThin';
import { useMediaQuery } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';

type NavBreadcrumbsProps = PropsWithChildren;

const NavBreadcrumbs = ({ children }: NavBreadcrumbsProps) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const arrayChildren = Children.toArray(children);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || arrayChildren.length === 0) {
        return null;
    }

    const renderBreadcrumbs = () => (
        <>
            {Children.map(arrayChildren, (child, index) => (
                <Fragment key={index}>
                    <IconamoonSignDivisionSlashThin
                        className={cn(
                            'shrink-0 opacity-30',
                            index === 0 && 'hidden',
                        )}
                    />
                    {child}
                </Fragment>
            ))}
        </>
    );

    // Breadcrumbs are mobile-only — there is no desktop portal container.
    if (isDesktop) {
        return null;
    }

    const portalContainer = document.getElementById('breadcrumbs-mobile');

    if (!portalContainer) {
        return null;
    }

    return createPortal(renderBreadcrumbs(), portalContainer);
};

export default NavBreadcrumbs;
