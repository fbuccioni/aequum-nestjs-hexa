export const WhenNoUserActions = [
    'allow-access',
    'deny-access',
    'return-default-policy',
    'throw-exception'
] as const;
export type WhenNoUserAction = typeof WhenNoUserActions[number];
