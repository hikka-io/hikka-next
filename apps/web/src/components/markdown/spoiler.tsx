import type { FC, ReactNode } from 'react';

import SpoilerReveal from './spoiler-reveal';

type Props = {
    children: ReactNode;
    className?: string;
};

const Spoiler: FC<Props> = ({ children, className }) => {
    return <SpoilerReveal className={className}>{children}</SpoilerReveal>;
};

export default Spoiler;
