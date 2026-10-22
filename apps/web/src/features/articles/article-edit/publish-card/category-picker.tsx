import { type FC, useId } from 'react';

import { SquareLibrary } from 'lucide-react';

import { ArticleCategoryEnum } from '@hikka/api';
import { ARTICLE_CATEGORY } from '@hikka/core';

import { ARTICLE_CATEGORY_ICONS } from '@/components/icons/article-category-icons';
import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import PanelSection from '@/components/panel-section';
import RadioCards from '@/components/radio-cards';
import { useSession } from '@/services/session';

import { useArticleContext } from '../article-provider';

const CATEGORY_HINTS: Record<ArticleCategoryEnum, string> = {
    [ArticleCategoryEnum.NEWS]: 'Анонси, трейлери, дати виходу',
    [ArticleCategoryEnum.REVIEWS]: 'Ваша думка про конкретний тайтл',
    [ArticleCategoryEnum.ORIGINAL]: 'Есеї, добірки, аналітика',
    [ArticleCategoryEnum.SYSTEM]: 'Оголошення команди Hikka',
};

const CategoryPicker: FC = () => {
    const { isAdmin, isModerator } = useSession();
    const draft = useArticleContext((state) => state.draft);
    const category = useArticleContext((state) => state.category);
    const setCategory = useArticleContext((state) => state.setCategory);
    const labelId = useId();

    const options = (Object.keys(ARTICLE_CATEGORY) as ArticleCategoryEnum[])
        .filter(
            (key) =>
                key === category ||
                !ARTICLE_CATEGORY[key].admin ||
                isAdmin() ||
                isModerator(),
        )
        .map((key) => ({
            value: key,
            title: ARTICLE_CATEGORY[key].title_ua,
            description: CATEGORY_HINTS[key],
            icon: ARTICLE_CATEGORY_ICONS[key] ?? MaterialSymbolsInfoRounded,
        }));

    return (
        <PanelSection icon={SquareLibrary} title="Категорія" labelId={labelId}>
            <RadioCards
                aria-labelledby={labelId}
                options={options}
                value={category}
                onValueChange={(value) =>
                    setCategory(value as ArticleCategoryEnum)
                }
                lockedHint={
                    draft ? undefined : 'Не змінюється після публікації'
                }
            />
        </PanelSection>
    );
};

export default CategoryPicker;
