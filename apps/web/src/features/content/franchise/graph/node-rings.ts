// The inner ring marks the current or selected title; keyboard focus on a `group/node` adds an outer one.
export const NODE_RING_CLASS = {
    plain: 'shadow-[0_0_0_3px_var(--card)] group-focus-visible/node:shadow-[0_0_0_3px_var(--card),0_0_0_5px_var(--foreground)]',
    ringed: 'shadow-[0_0_0_2px_var(--node-ring),0_0_0_5px_var(--card)] group-focus-visible/node:shadow-[0_0_0_2px_var(--node-ring),0_0_0_4px_var(--card),0_0_0_6px_var(--foreground)]',
};

export const NODE_RING_COLOR = {
    current: '[--node-ring:var(--primary-foreground)]',
    selected: '[--node-ring:var(--foreground)]',
};
