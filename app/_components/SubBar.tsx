'use client';

import { PropsWithChildren, useEffect, useState, Children } from 'react';
import { createPortal } from 'react-dom';
import IconamoonSignDivisionSlashThin from '~icons/iconamoon/sign-division-slash-thin';
import clsx from "clsx";
import useIsMobile from "@/utils/hooks/useIsMobile";
import {useInView} from "react-intersection-observer";

interface Props extends PropsWithChildren {
    mobileOnly?: boolean;
}

const Component = ({ children, mobileOnly }: Props) => {
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    if (isMobile) {
        return createPortal(<>{children}</>,
            document.getElementById('subbar-mobile')!,
        );
    }

    if (mobileOnly) {
        return null;
    }

    return createPortal(
        <>{children}</>,
        document.getElementById('subbar')!,
    );
};

export default Component;
