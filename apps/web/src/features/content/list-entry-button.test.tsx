import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { ReadListButton, WatchListButton } from '@/components/tracking';
import type { ContentInfo } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

import ListEntryButton from './list-entry-button';

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ slug: 'some-slug' }),
}));

vi.mock('@/components/tracking', () => {
    const stub = (name: string) => (props: Record<string, unknown>) => (
        <i
            data-name={name}
            data-props={JSON.stringify(
                Object.fromEntries(Object.entries(props).sort()),
            )}
        />
    );

    return {
        WatchListButton: stub('watch'),
        ReadListButton: stub('read'),
    };
});

type AnyContentType = MainContentTypeEnum | 'character' | 'person';

type LegacyProps = {
    className?: string;
    content_type: AnyContentType;
};

const LegacyActionBarButton = ({
    content_type,
    content,
    disabled,
}: LegacyProps & {
    content?: ContentInfo<LegacyProps['content_type']>;
    disabled?: boolean;
}) => {
    const params = useParams();

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchListButton
                    slug={String(params.slug)}
                    size="icon-md"
                    anime={content?.data_type === 'anime' ? content : undefined}
                    disabled={disabled}
                />
            );
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return (
                <ReadListButton
                    slug={String(params.slug)}
                    size="icon-md"
                    content_type={content_type}
                    content={
                        content?.data_type === 'manga' ||
                        content?.data_type === 'novel'
                            ? content
                            : undefined
                    }
                    disabled={disabled}
                />
            );
        case ContentTypeEnum.PERSON:
        case ContentTypeEnum.CHARACTER:
            return null;
        default:
            return null;
    }
};

const LegacyActionsButton = ({
    content_type,
    content,
    user,
}: {
    content_type: MainContentTypeEnum;
    content?: ContentInfo<MainContentTypeEnum>;
    user: boolean;
}) => {
    const params = useParams();

    return content_type === ContentTypeEnum.ANIME ? (
        <WatchListButton
            disabled={!user}
            slug={String(params.slug)}
            anime={content?.data_type === 'anime' ? content : undefined}
        />
    ) : (
        <ReadListButton
            content_type={content_type}
            disabled={!user}
            slug={String(params.slug)}
            content={
                content?.data_type === 'manga' || content?.data_type === 'novel'
                    ? content
                    : undefined
            }
        />
    );
};

const MAIN_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const;

const CONTENTS = [
    undefined,
    { data_type: 'anime', slug: 'some-slug' },
    { data_type: 'manga', slug: 'some-slug' },
    { data_type: 'novel', slug: 'some-slug' },
    { data_type: 'character', slug: 'some-slug' },
] as unknown as (ContentInfo<MainContentTypeEnum> | undefined)[];

const CASES = MAIN_TYPES.flatMap((content_type) =>
    CONTENTS.flatMap((content) =>
        [true, false].map((user) => ({ content_type, content, user })),
    ),
);

describe('ListEntryButton', () => {
    it.each(CASES)('renders the action bar button (%o)', (props) => {
        const html = renderToStaticMarkup(
            <ListEntryButton
                content_type={props.content_type}
                content={props.content}
                disabled={!props.user}
                size="icon-md"
            />,
        );

        expect(html).toContain('<i data-name=');
        expect(html).toBe(
            renderToStaticMarkup(
                <LegacyActionBarButton
                    content_type={props.content_type}
                    content={props.content}
                    disabled={!props.user}
                />,
            ),
        );
        expect(html).not.toBe(
            renderToStaticMarkup(<LegacyActionsButton {...props} />),
        );
    });

    it.each(CASES)('renders the actions button (%o)', (props) => {
        const html = renderToStaticMarkup(
            <ListEntryButton
                content_type={props.content_type}
                content={props.content}
                disabled={!props.user}
            />,
        );

        expect(html).toContain('<i data-name=');
        expect(html).toBe(
            renderToStaticMarkup(<LegacyActionsButton {...props} />),
        );
    });

    it.each([ContentTypeEnum.CHARACTER, ContentTypeEnum.PERSON] as const)(
        'renders nothing for %s',
        (content_type) => {
            expect(
                renderToStaticMarkup(
                    <ListEntryButton
                        content_type={content_type}
                        size="icon-md"
                    />,
                ),
            ).toBe(
                renderToStaticMarkup(
                    <LegacyActionBarButton content_type={content_type} />,
                ),
            );
            expect(
                renderToStaticMarkup(
                    <ListEntryButton
                        content_type={content_type}
                        size="icon-md"
                    />,
                ),
            ).toBe('');
        },
    );
});
