import { ContentTypeEnum, ReadContentType } from '@hikka/client';

interface Props {
    list: Record<string, any>[];
    type: ReadContentType | ContentTypeEnum.ANIME;
}

const Component = ({ list, type }: Props) => {
    const typeName =
        type === ContentTypeEnum.ANIME ? 'аніме' : 'манґи та ранобе';

    return (
        <div>
            <p>
                У вашому списку знайдено{' '}
                <span className="border-primary-border bg-primary text-primary-foreground rounded-sm border px-1">
                    {list.length}
                </span>{' '}
                {typeName}, що готові до імпорту
            </p>
        </div>
    );
};

export default Component;
