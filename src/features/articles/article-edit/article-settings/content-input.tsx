'use client';

import { FC } from 'react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import { Button } from '@/components/ui/button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { Label } from '@/components/ui/label';

import SearchModal from '@/features/modals/search-modal/search-modal.component';

import { useArticleContext } from '@/services/providers/article-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/adapters/convert-title';
import { CONTENT_TYPES } from '@/utils/constants/common';

interface Props {}

const ContentInput: FC<Props> = () => {
    const { titleLanguage } = useSettingsContext();
    const content = useArticleContext((state) => state.content);
    const setContent = useArticleContext((state) => state.setContent);

    const contentWithTitle = content
        ? convertTitle({
              data: content,
              titleLanguage: titleLanguage!,
          })
        : undefined;

    return (
        <div className="flex flex-col gap-4">
            <Label className="text-muted-foreground">Контент</Label>
            {content && (
                <HorizontalCard href={`/${content.data_type}/${content.slug}`}>
                    <HorizontalCardImage image={content.image} />
                    <HorizontalCardContainer className="flex-1">
                        <HorizontalCardTitle className="line-clamp-2">
                            {contentWithTitle?.title}
                        </HorizontalCardTitle>
                        <HorizontalCardDescription>
                            {CONTENT_TYPES[content.data_type].title_ua}
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setContent(undefined)}
                    >
                        <MaterialSymbolsDeleteForeverRounded className="size-4" />
                    </Button>
                </HorizontalCard>
            )}
            {!content && (
                <SearchModal
                    allowedTypes={['anime', 'manga', 'novel']}
                    onClick={(value) =>
                        setContent(
                            value as API.MainContent & {
                                title?: string;
                            },
                        )
                    }
                    type="button"
                >
                    <Button variant="secondary">Додати контент</Button>
                </SearchModal>
            )}
        </div>
    );
};

export default ContentInput;
