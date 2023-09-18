import { cache } from 'react';

import { QueryClient } from '@tanstack/query-core';

const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
