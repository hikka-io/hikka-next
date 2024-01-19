'use client';

import { Hydrate, HydrateProps } from '@tanstack/react-query';

function RQHydrate(props: HydrateProps) {
    return <Hydrate {...props} />;
}

export default RQHydrate;
