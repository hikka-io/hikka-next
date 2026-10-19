import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';
import { contentPath } from '@hikka/core';

import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link } from '@/utils/navigation';

import { useArticleContext } from '../article-provider';

type Props = {
    size?: 'icon-sm' | 'icon-md';
};

const PreviewButton: FC<Props> = ({ size = 'icon-sm' }) => {
    const slug = useArticleContext((state) => state.slug);

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        variant="outline"
                        size={size}
                        aria-label="Переглянути"
                        disabled={!slug}
                        render={
                            slug ? (
                                <Link
                                    target="_blank"
                                    to={contentPath(
                                        ContentTypeEnum.ARTICLE,
                                        slug,
                                    )}
                                />
                            ) : undefined
                        }
                    />
                }
            >
                <MaterialSymbolsVisibilityOutlineRounded />
            </TooltipTrigger>
            <TooltipContent>Переглянути</TooltipContent>
        </Tooltip>
    );
};

export default PreviewButton;
