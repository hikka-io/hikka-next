import React, { PropsWithChildren } from 'react';

import Link from 'next/link';

const Component = ({ children }: PropsWithChildren) => {
    return <Link href={children as string} target="_blank" rel="nofollow" />;
};

export default Component;