import { ContentTypeEnum } from '@hikka/api';

import { CONTENT_TYPES } from '@/utils/labels';

type Props = {
    list: Record<string, any>[];
    type: ContentTypeEnum;
};

const FoundList = ({ list, type }: Props) => {
    const typeName =
        type === ContentTypeEnum.ANIME
            ? CONTENT_TYPES[ContentTypeEnum.ANIME].genitive
            : `${CONTENT_TYPES[ContentTypeEnum.MANGA].genitive} та ${CONTENT_TYPES[ContentTypeEnum.NOVEL].genitive}`;

    return (
        <div>
            <p>
                У вашому списку знайдено{' '}
                <span className="rounded-sm border border-primary-border bg-primary px-1 text-primary-foreground">
                    {list.length}
                </span>{' '}
                {typeName}, що готові до імпорту
            </p>
        </div>
    );
};

export default FoundList;
