import type { FC } from 'react';

import { X } from 'lucide-react';

import { MediaTooltipBody } from '@/components/content-card/tooltips';
import { Button } from '@/components/ui/button';
import { contentPath } from '@/utils/content-paths';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { RELATION_FORMS } from '@/utils/i18n/word-forms';

import RelationLine from '../components/relation-line';
import type { FranchiseModel, FranchiseNode } from '../franchise-model';

type Props = {
    model: FranchiseModel;
    node: FranchiseNode;
    links: number;
    onSelect: (id: string) => void;
    onClose: () => void;
};

const GraphDetails: FC<Props> = ({ model, node, links, onSelect, onClose }) => {
    const linkText = `${links} ${getDeclensionWord(links, RELATION_FORMS)}`;

    return (
        <>
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Закрити"
                className="absolute top-2 right-2 text-muted-foreground"
                onClick={onClose}
            >
                <X />
            </Button>
            {node === model.current ? (
                <span className="-mb-2 truncate pr-8 font-medium text-relation-sequel text-xs leading-4">
                    Цей тайтл, {linkText}
                </span>
            ) : (
                <RelationLine
                    model={model}
                    node={node}
                    onSelect={onSelect}
                    suffix={`, ${linkText}`}
                    className="-mb-2 pr-8"
                />
            )}
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
