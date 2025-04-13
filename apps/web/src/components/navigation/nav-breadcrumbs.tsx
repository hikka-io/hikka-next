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
import { cn } from '@/utils/utils';
import IconamoonSignDivisionSlashThin from '../icons/iconamoon/IconamoonSignDivisionSlashThin';

interface Props extends PropsWithChildren {}

const Component = ({ children }: Props) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const arrayChildren = Children.toArray(children);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || arrayChildren.length === 0) {
        return null;
    }

    if (!isDesktop) {
        return createPortal(
            <>
                {Children.map(arrayChildren, (child, index) => {
                    return (
                        <Fragment key={index}>
                            <IconamoonSignDivisionSlashThin
                                className={cn(
                                    'opacity-30',
                                    index === 0 && 'hidden md:block',
                                )}
                            />
                            {child}
                        </Fragment>
                    );
                })}
            </>,
            document.getElementById('breadcrumbs-mobile')!,
        );
    }

    return createPortal(
        <>
            {Children.map(arrayChildren, (child, index) => {
                return (
                    <Fragment key={index}>
                        <IconamoonSignDivisionSlashThin
                            className={cn(
                                'opacity-30',
                                index === 0 && 'hidden md:block',
                            )}
                        />
                        {child}
                    </Fragment>
                );
            })}
        </>,
        document.getElementById('breadcrumbs')!,
    );
};

export default Component;
