export const accentBarClasses: Record<Hikka.NotificationAccent, string> = {
    primary: 'border-l-primary-border',
    success: 'border-l-success-border',
    warning: 'border-l-warning-border',
    destructive: 'border-l-destructive-border',
    info: 'border-l-info-border',
    neutral: 'border-l-border',
};

export const accentBadgeClasses: Record<Hikka.NotificationAccent, string> = {
    primary: 'bg-primary text-primary-foreground border-primary-border',
    success: 'bg-success text-success-foreground border-success-border',
    warning: 'bg-warning text-warning-foreground border-warning-border',
    destructive:
        'bg-destructive text-destructive-foreground border-destructive-border',
    info: 'bg-info text-info-foreground border-info-border',
    neutral: 'bg-muted text-muted-foreground border-border',
};
