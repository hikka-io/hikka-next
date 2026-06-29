export const accentBarClasses: Record<Hikka.NotificationAccent, string> = {
    primary: 'border-l-primary-foreground/20',
    success: 'border-l-success-foreground/20',
    warning: 'border-l-warning-foreground/20',
    destructive: 'border-l-destructive-foreground/20',
    info: 'border-l-info-foreground/20',
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
