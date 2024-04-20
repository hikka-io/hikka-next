'use client';

import clsx from 'clsx';
import {
    Children,
    Fragment,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import IconamoonSignDivisionSlashThin from '~icons/iconamoon/sign-division-slash-thin';

import { useMediaQuery } from '@/services/hooks/useMediaQuery';

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
            <div className="flex h-auto min-h-10 flex-1 items-center gap-4 overflow-hidden px-4 md:hidden">
                {Children.map(arrayChildren, (child, index) => {
                    return (
                        <Fragment key={child.toString() + '-' + index}>
                            <IconamoonSignDivisionSlashThin
                                className={clsx(
                                    'opacity-30',
                                    index === 0 && 'hidden md:block',
                                )}
                            />
                            {child}
                        </Fragment>
                    );
                })}
            </div>,
            document.getElementById('breadcrumbs-mobile')!,
        );
    }

    return createPortal(
        <>
            {Children.map(arrayChildren, (child, index) => {
                return (
                    <>
                        <IconamoonSignDivisionSlashThin
                            className={clsx(
                                'opacity-30',
                                index === 0 && 'hidden md:block',
                            )}
                        />
                        {child}
                    </>
                );
            })}
        </>,
        document.getElementById('breadcrumbs')!,
    );
};

export default Component;
