import P from '@/components/typography/p';

interface Props {
    readList: Record<string, any>[];
}

const Component = ({ readList }: Props) => {
    return (
        <div>
            <P>
                У вашому списку знайдено{' '}
                <span className="rounded-sm border border-primary-border bg-primary px-1 text-primary-foreground">
                    {readList.length}
                </span>{' '}
                манґи та ранобе, що готові до імпорту
            </P>
        </div>
    );
};

export default Component;
