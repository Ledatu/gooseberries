export interface TabsItemProps {
    title: string;
    href?: string;
    id?: string;
    disabled?: boolean,
    icon?: any
}

export interface CustomTabsProps {
    items: TabsItemProps[];
    currentModule: any,
    setModule: Function,
    // activeTab: string | null;
}