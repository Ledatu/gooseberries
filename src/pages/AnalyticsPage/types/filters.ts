export type FilterComp = {
    compMode: 'bigger' | 'lower' | 'equal' | 'not equal' | 'include' | 'not include';
    val: string;
};

export type Filter = Record<string, FilterComp>;
