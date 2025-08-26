import P from '@/components/typography/p';

interface Props {
    watchList: Record<string, any>[];
}

const Component = ({ watchList }: Props) => {
    return (
        <div>
            <P>
                У вашому списку знайдено{' '}
                <span className="bg-primary text-primary-foreground border-primary-border rounded-sm border px-1">
                    {watchList.length}
                </span>{' '}
                аніме, що готові до імпорту
            </P>
        </div>
    );
};

export default Component;
