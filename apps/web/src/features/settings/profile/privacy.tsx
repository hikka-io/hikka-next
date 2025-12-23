'use client';

import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Component = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div>
                    <Label>Підсумок року</Label>
                    <P className="text-sm text-muted-foreground">
                        Статистика підсумку року буде доступна для всіх
                    </P>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
            </div>
        </div>
    );
};

export default Component;
