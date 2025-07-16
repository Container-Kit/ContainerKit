export type Tab = {
    label: string;
    value: string;
};
export type Tabs = Tab[];

export const tabs: Tabs = [
    {
        label: 'Logs',
        value: 'logs'
    },
    {
        label: 'Inspect',
        value: 'inspect'
    }
];
