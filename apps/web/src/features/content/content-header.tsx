import type { FC, ReactNode } from 'react';

import { type CommentContentTypeEnum, ContentTypeEnum } from '@hikka/api';
import { contentPath } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { MaterialSymbolsChevronRightRounded } from '@/components/icons/material-symbols/MaterialSymbolsChevronRightRounded';
import Block from '@/components/ui/block';
import { ChipTabs } from '@/components/ui/chip-tabs';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import TextLink from '@/components/ui/text-link';
import { usePageTitleAnchor } from '@/features/app-shell';
import { cn } from '@/utils/cn';
import { findCurrentNavRoute, usePathname } from '@/utils/navigation';

import { contentNavRoutes, hasContentNav } from './content-nav-routes';
import { useContent } from './use-content';

type Props = {
    slug: string;
    content_type: CommentContentTypeEnum | typeof ContentTypeEnum.USER;
    title?: string;
    count?: number;
    actions?: ReactNode;
};

const ContentHeader: FC<Props> = ({
    slug,
    content_type,
    title,
    count,
    actions,
}) => {
    const { data } = useContent({ content_type, slug });
    const pathname = usePathname();
    const titleAnchor = usePageTitleAnchor();
    const routes = hasContentNav(content_type)
        ? contentNavRoutes(content_type, slug)
        : [];
    const current = findCurrentNavRoute(routes, pathname);
    const hasTabs = routes.length > 0;

    return (
        <>
            <Block
                variant="card"
                flushOnMobile
                className={cn(
                    'backdrop-blur',
                    hasTabs && 'rounded-b-none sm:rounded-b-none',
                )}
            >
                <Header className="gap-4">
                    {data?.image && (
                        <PosterCard
                            containerClassName="rounded-(--base-radius)"
                            className="w-11 md:w-14"
                            containerRatio={
                                content_type === ContentTypeEnum.USER
                                    ? 1
                                    : undefined
                            }
                            image={data.image}
                        />
                    )}
                    <div className="flex min-w-0 flex-1 flex-col items-start">
                        <TextLink
                            to={contentPath(content_type, slug)}
                            className="flex max-w-full items-center font-medium text-muted-foreground text-sm hover:text-foreground"
                        >
                            <span className="truncate">{data?.title}</span>
                            <MaterialSymbolsChevronRightRounded
                                aria-hidden
                                className="shrink-0"
                            />
                        </TextLink>
                        <HeaderTitle
                            ref={titleAnchor}
                            as="h1"
                            size="page"
                            count={count}
                        >
                            {title ?? current?.title_ua}
                            {data?.title && (
                                <span className="sr-only">: {data.title}</span>
                            )}
                        </HeaderTitle>
                    </div>
                    {actions && <HeaderActions>{actions}</HeaderActions>}
                </Header>
            </Block>
            {hasTabs && (
                <Block
                    variant="card"
                    flushOnMobile
                    className="rounded-t-none border-t-0 p-2 backdrop-blur sm:rounded-t-none md:sticky md:top-16 md:z-1"
                >
                    <ChipTabs
                        options={routes.map((route) => ({
                            label: route.title_ua,
                            value: route.slug,
                            to: route.url,
                        }))}
                        value={current?.slug ?? ''}
                        className="mr-0 pr-0"
                    />
                </Block>
            )}
        </>
    );
};

export default ContentHeader;
