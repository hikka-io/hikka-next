'use client';

import {
    Children,
    Fragment,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';

import IconamoonSignDivisionSlashThin from '../icons/iconamoon/IconamoonSignDivisionSlashThin';

interface NavBreadcrumbsProps extends PropsWithChildren {}

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
                            'opacity-30',
                            index === 0 && 'hidden md:block',
                        )}
                    />
                    {child}
                </Fragment>
            ))}
        </>
    );

    const portalContainer = isDesktop
        ? document.getElementById('breadcrumbs')
        : document.getElementById('breadcrumbs-mobile');

    if (!portalContainer) {
        console.warn('Breadcrumbs portal container not found');
        return null;
    }

    return createPortal(renderBreadcrumbs(), portalContainer);
};

export default NavBreadcrumbs;
