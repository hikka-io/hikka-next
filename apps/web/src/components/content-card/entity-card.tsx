import { type FC, type ReactNode, useState } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';

import type { CardStatus } from './content-status';
import ContextMenuOverlay from './context-menu-overlay';
import { type CardEntity, type ResolvedEntity, resolveEntity } from './entity';
import PosterCard, { type PosterCardProps } from './poster-card';
import { CharacterTooltip, MediaTooltip, PersonTooltip } from './tooltips';

export type EntityCardProps = Omit<
    PosterCardProps,
    'status' | 'renderTooltip' | 'tooltipDisabled'
> & {
    entity: CardEntity;
    withContextMenu?: boolean;
};

function statusOf(resolved: ResolvedEntity): CardStatus | undefined {
    if (resolved.watch) return { value: resolved.watch.status, kind: 'watch' };
    if (resolved.read) return { value: resolved.read.status, kind: 'read' };
    return undefined;
}

/**
 * A card bound to a subject: it derives the link, poster, title, tracking badge,
 * hover card and context menu from one `entity`, so those can never disagree
 * with each other.
 *
 * Passing `title`/`image`/`to` overrides what it derives, and passing `null`
 * suppresses it — only an absent prop falls back to the entity.
 */
const EntityCard: FC<EntityCardProps> = ({
    entity,
    withContextMenu,
    title,
    image,
    href,
    to,
    ...props
}) => {
    const resolved = resolveEntity(entity);
    const derivedTitle = useTitle(entity.data);
    const [menuOpen, setMenuOpen] = useState(false);

    const resolvedImage = image !== undefined ? image : resolved.image;
    const resolvedHref = to ?? href ?? resolved.href;

    const card = (
        <PosterCard
            {...props}
            title={title !== undefined ? title : derivedTitle}
            image={resolvedImage}
            to={resolvedHref}
            status={statusOf(resolved)}
            tooltipDisabled={menuOpen}
            renderTooltip={(trigger) => entityTooltip(resolved, trigger)}
        />
    );

    if (!withContextMenu) {
        return card;
    }

    return (
        <ContextMenuOverlay
            href={resolvedHref}
            slug={resolved.slug}
            content_type={resolved.content_type}
            image={resolvedImage}
            onOpenChange={setMenuOpen}
        >
            {card}
        </ContextMenuOverlay>
    );
};

function entityTooltip(
    resolved: ResolvedEntity,
    trigger: ReactNode,
): ReactNode {
    switch (resolved.content_type) {
        case ContentTypeEnum.ANIME:
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return (
                <MediaTooltip
                    type={resolved.content_type}
                    slug={resolved.slug}
                    watch={resolved.watch}
                    read={resolved.read}
                    item={resolved.tooltipItem}
                >
                    {trigger}
                </MediaTooltip>
            );
        case ContentTypeEnum.CHARACTER:
            return (
                <CharacterTooltip slug={resolved.slug}>
                    {trigger}
                </CharacterTooltip>
            );
        case ContentTypeEnum.PERSON:
            return (
                <PersonTooltip slug={resolved.slug}>{trigger}</PersonTooltip>
            );
        default:
            return trigger;
    }
}

export default EntityCard;
