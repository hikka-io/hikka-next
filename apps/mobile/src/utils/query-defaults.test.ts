import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import {
    genresQueryKey,
    notificationsInfiniteQueryKey,
    unseenNotificationsCountQueryKey,
} from '@hikka/api';

import { applyQueryDefaults } from './query-defaults';

const client = new QueryClient();
applyQueryDefaults(client);

describe('applyQueryDefaults', () => {
    it('polls the unseen count and refetches it on return to the app', () => {
        expect(
            client.getQueryDefaults(unseenNotificationsCountQueryKey()),
        ).toMatchObject({
            refetchInterval: 60_000,
            refetchOnWindowFocus: true,
        });
    });

    it('leaves the notification list on the shared policy', () => {
        expect(
            client.getQueryDefaults(notificationsInfiniteQueryKey()),
        ).toEqual({});
    });

    it('keeps genres static', () => {
        expect(client.getQueryDefaults(genresQueryKey())).toMatchObject({
            staleTime: Number.POSITIVE_INFINITY,
        });
    });
});
