import type { FC } from 'react';

import { X } from 'lucide-react';

import { MediaTooltipBody } from '@/components/content-card/tooltips';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { RELATION_FORMS } from '@/utils/i18n/word-forms';

import FranchiseRow from '../components/franchise-row';
import RelationLabel from '../components/relation-label';
import RelationLine from '../components/relation-line';
import type { FranchiseModel, FranchiseNode } from '../franchise-model';

type Props = {
    model: FranchiseModel;
    node: FranchiseNode;
    links: number;
    compact: boolean;
    onSelect: (id: string) => void;
    onClose: () => void;
};

const GraphDetails: FC<Props> = ({
    model,
    node,
    links,
    compact,
    onSelect,
    onClose,
}) => {
    const suffix = compact
        ? undefined
        : `, ${links} ${getDeclensionWord(links, RELATION_FORMS)}`;
    const relation =
        node === model.current ? (
            <RelationLabel
                group="sequel"
                className={cn(!compact && '-mb-2 pr-8')}
            >
                <span className="truncate">Цей тайтл{suffix}</span>
            </RelationLabel>
        ) : (
            <RelationLine
                model={model}
                node={node}
                onSelect={onSelect}
                suffix={suffix}
                className={cn(!compact && '-mb-2 pr-8')}
            />
        );
    const close = (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Закрити"
                        className={cn(
                            'shrink-0 text-muted-foreground',
                            !compact && 'absolute top-2 right-2',
                        )}
                        onClick={onClose}
                    />
                }
            >
                <X />
            </TooltipTrigger>
            <TooltipContent>Закрити</TooltipContent>
        </Tooltip>
    );

    if (compact) {
        return (
            <FranchiseRow
                content={node.content}
                label={relation}
                action={close}
            />
        );
    }

    return (
        <>
            {close}
            {relation}
            <MediaTooltipBody
                type={node.contentType}
                slug={node.content.slug}
                item={node.content}
                titleHref={contentPath(node.contentType, node.content.slug)}
            />
        </>
    );
};

export default GraphDetails;
