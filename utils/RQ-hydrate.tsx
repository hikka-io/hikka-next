'use client';

import {
    HydrationBoundary,
    HydrationBoundaryProps,
} from '@tanstack/react-query';

function RQHydrate(props: HydrationBoundaryProps) {
    return <HydrationBoundary {...props} />;
}

export default RQHydrate;
