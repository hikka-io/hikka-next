import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const NoSpoiler = ({ children }: Props) => {
    return <span className="spoiler-blur-sm">{children}</span>;
};

export default NoSpoiler;
