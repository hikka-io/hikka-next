import { ContentTypeEnum } from '@hikka/api';

type Props = {
    list: Record<string, any>[];
    type: ContentTypeEnum;
};

const FoundList = ({ list, type }: Props) => {
    const typeName =
        type === ContentTypeEnum.ANIME ? 'аніме' : 'манґи та ранобе';

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
