import React from 'react';

import { Label } from '@/app/_components/ui/label';
import { Progress } from '@/app/_components/ui/progress';

const Component = () => {
    return (
        <div className="flex flex-col gap-4 flex-1 bg-secondary/30 border border-secondary/60 p-4 rounded-md">
            <Label className="text-muted-foreground">Час аніме</Label>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 justify-between items-end">
                    <h5>4 місяці та 3 тижні</h5>
                    <p className="text-muted-foreground text-xs">
                        1,324 години
                    </p>
                </div>
                <Progress className="h-2" value={10} />
            </div>
        </div>
    );
};

export default Component;