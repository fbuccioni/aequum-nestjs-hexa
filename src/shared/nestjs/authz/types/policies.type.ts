export const Policies = ['allow', 'deny'] as const;
export type Policy = typeof Policies[number];
