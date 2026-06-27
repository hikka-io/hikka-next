import type { FC } from 'react';

import { ArticleContentEnum } from '@hikka/api';

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
import { SearchModal } from '@/features/search';
import { useArticleContext } from '@/services/providers/article-provider';
import { CONTENT_TYPES } from '@/utils/constants/common';
import { useTitle } from '@/utils/title/use-title';

type Props = {};

const ContentInput: FC<Props> = () => {
    const content = useArticleContext((state) => state.content);
    const setContent = useArticleContext((state) => state.setContent);
    const contentTitle = useTitle(content);

    return (
        <div className="flex flex-col gap-4">
            <Label className="text-muted-foreground">Контент</Label>
            {content && (
                <HorizontalCard>
                    <HorizontalCardImage
                        image={content.image}
                        href={`/${content.data_type}/${content.slug}`}
                    />
                    <HorizontalCardContainer className="flex-1">
                        <HorizontalCardTitle
                            className="line-clamp-2"
                            href={`/${content.data_type}/${content.slug}`}
                        >
                            {contentTitle}
                        </HorizontalCardTitle>
                        <HorizontalCardDescription>
                            {
                                CONTENT_TYPES[
                                    content.data_type as keyof typeof CONTENT_TYPES
                                ].title_ua
                            }
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
                    allowedTypes={[
                        ArticleContentEnum.ANIME,
                        ArticleContentEnum.MANGA,
                        ArticleContentEnum.NOVEL,
                    ]}
                    onClick={(value) =>
                        setContent(
                            value as unknown as Parameters<
                                typeof setContent
                            >[0],
                        )
                    }
                    type="button"
                >
                    <Button variant="secondary" size="md">
                        Додати контент
                    </Button>
                </SearchModal>
            )}
        </div>
    );
};

export default ContentInput;
