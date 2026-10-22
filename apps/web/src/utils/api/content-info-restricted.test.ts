import { type FetchQueryOptions, QueryClient } from '@tanstack/react-query';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    createRequestClient,
    ExternalTypeEnum,
    setAuthToken,
} from '@hikka/api';

import { contentInfoOptions } from './content-queries';

const GENERAL = {
    url: 'https://general.example.test/title',
    text: 'General',
    type: ExternalTypeEnum.GENERAL,
};
const WATCH = {
    url: 'https://watch.example.test/title',
    text: 'Watch',
    type: ExternalTypeEnum.WATCH,
};

vi.mock('@hikka/api', async (importOriginal) => {
    const api = await importOriginal<typeof import('@hikka/api')>();

    return {
        ...api,
        animeSlugOptions: (
            options: Parameters<typeof api.animeSlugOptions>[0],
        ) => ({
            ...api.animeSlugOptions(options),
            queryFn: async () => ({ slug: 'x', external: [GENERAL, WATCH] }),
        }),
    };
});

const fetchExternal = async (
    client?: Parameters<typeof contentInfoOptions>[2],
) => {
    const data = (await new QueryClient().fetchQuery(
        contentInfoOptions(
            ContentTypeEnum.ANIME,
            'x',
            client,
        ) as FetchQueryOptions,
    )) as { external: { type: ExternalTypeEnum }[] };

    return data.external.map((link) => link.type);
};

beforeAll(() => {
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
});

afterEach(() => {
    setAuthToken(undefined);
});

describe('contentInfoOptions restricted externals', () => {
    it('strips watch/read links from an anonymous browser fetch', async () => {
        expect(await fetchExternal()).toEqual([ExternalTypeEnum.GENERAL]);
    });

    it('keeps them for a signed-in browser fetch', async () => {
        setAuthToken('token');

        expect(await fetchExternal()).toEqual([
            ExternalTypeEnum.GENERAL,
            ExternalTypeEnum.WATCH,
        ]);
    });

    it('leaves SSR request clients to the detail loader', async () => {
        const client = createRequestClient({
            baseUrl: 'https://api.example.test',
        });

        expect(await fetchExternal(client)).toEqual([
            ExternalTypeEnum.GENERAL,
            ExternalTypeEnum.WATCH,
        ]);
    });
});
