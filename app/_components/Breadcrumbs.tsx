'use client';

import { PropsWithChildren, useEffect, useState, Children } from 'react';
import { createPortal } from 'react-dom';
import IconamoonSignDivisionSlashThin from '~icons/iconamoon/sign-division-slash-thin';
import clsx from "clsx";
import useIsMobile from "@/utils/hooks/useIsMobile";

interface Props extends PropsWithChildren {}

const Component = ({ children }: Props) => {
    const isMobile = useIsMobile();
    const arrayChildren = Children.toArray(children);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    });

    if (!mounted || arrayChildren.length === 0) {
        return null;
    }

    return createPortal(
        <>{!isMobile ? Children.map(arrayChildren, (child, index) => {
            return (
                <>
                    <IconamoonSignDivisionSlashThin className={clsx("opacity-30", index === 0 && "hidden lg:block")} />
                    {child}
                </>
            )
        }) : arrayChildren[arrayChildren.length - 1]}</>,
        document.getElementById('nav-items')!,
    );
};

export default Component;
