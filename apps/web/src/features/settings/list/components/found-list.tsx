import { ContentTypeEnum, ReadContentType } from '@hikka/client';

import P from '@/components/typography/p';

interface Props {
    list: Record<string, any>[];
    type: ReadContentType | ContentTypeEnum.ANIME;
}

const Component = ({ list, type }: Props) => {
    const typeName =
        type === ContentTypeEnum.ANIME ? 'аніме' : 'манґи та ранобе';

    return (
        <div>
            <P>
                У вашому списку знайдено{' '}
                <span className="border-primary-border bg-primary text-primary-foreground rounded-sm border px-1">
                    {list.length}
                </span>{' '}
                {typeName}, що готові до імпорту
            </P>
        </div>
    );
};

export default Component;
