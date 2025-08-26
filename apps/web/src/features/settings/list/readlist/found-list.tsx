import P from '@/components/typography/p';

interface Props {
    readList: Record<string, any>[];
}

const Component = ({ readList }: Props) => {
    return (
        <div>
            <P>
                У вашому списку знайдено{' '}
                <span className="bg-primary text-primary-foreground border-primary-border rounded-sm border px-1">
                    {readList.length}
                </span>{' '}
                манґи та ранобе, що готові до імпорту
            </P>
        </div>
    );
};

export default Component;
