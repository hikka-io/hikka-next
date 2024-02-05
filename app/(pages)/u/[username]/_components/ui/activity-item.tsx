import Completed from '@/app/_components/icons/watch-status/completed';
import BaseCard from '@/app/_components/ui/base-card';
import { Label } from '@/app/_components/ui/label';

interface Props {}

const Component = ({}: Props) => {
    return (
        <div className="flex gap-4 items-center">
            <div className="w-12">
                <BaseCard />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <Label>Назва аніме</Label>
                <p className="text-xs text-muted-foreground">
                    Перегляд завершено
                </p>
                <p className="text-xs text-muted-foreground opacity-60">
                    2 дні тому
                </p>
            </div>
            <div className="w-6 h-6 flex items-center justify-center rounded bg-secondary/30 border border-secondary/60">
                <Completed />
            </div>
        </div>
    );
};

export default Component;