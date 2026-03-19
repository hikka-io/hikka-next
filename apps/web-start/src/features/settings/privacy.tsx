'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Component = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div>
                    <Label>Підсумок року</Label>
                    <p className="text-muted-foreground text-sm">
                        Статистика підсумку року буде доступна для всіх
                    </p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
            </div>
        </div>
    );
};

export default Component;
