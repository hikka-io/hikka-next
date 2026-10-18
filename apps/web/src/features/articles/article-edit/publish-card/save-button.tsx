import type { FC } from 'react';

import { Save } from 'lucide-react';

import MaterialSymbolsRefreshRounded from '@/components/icons/material-symbols/MaterialSymbolsRefreshRounded';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useArticleContext } from '../article-provider';
import { type ArticleSave, selectSaveDisabled } from '../use-article-save';

type Props = Pick<ArticleSave, 'save'> & {
    size?: 'sm' | 'md';
    className?: string;
};

const SaveButton: FC<Props> = ({ save, size = 'md', className }) => {
    const draft = useArticleContext((state) => state.draft);
    const disabled = useArticleContext(selectSaveDisabled);

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        size={size}
                        variant={draft ? 'secondary' : 'default'}
                        className={className}
                        disabled={disabled}
                        onClick={save}
                    />
                }
            >
                {draft ? <Save /> : <MaterialSymbolsRefreshRounded />}
                {draft ? 'Зберегти' : 'Оновити'}
            </TooltipTrigger>
            <TooltipContent>
                {draft ? 'Зберегти чернетку' : 'Оновити статтю'} (⌘+S)
            </TooltipContent>
        </Tooltip>
    );
};

export default SaveButton;
