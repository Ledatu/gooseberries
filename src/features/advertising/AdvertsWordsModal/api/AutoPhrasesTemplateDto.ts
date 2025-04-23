interface Rules {
    key: string;
    biggerOrEqual: boolean;
    val: number;
    viewsThreshold: number;
    thresholdKey: string;
}

interface AutoPhrasesTemplateDto {
    name: string;
    isFixed: boolean;
    seller_id: string;
    phrasesSelectedByPlus: string[];
    phrasesExcludedByMinus: string[];
    fixedClusters: string[];
    viewsThreshold: number;
    selectedByAutoPhrases: string[];
    includes: string[];
    notIncludes: string[];
    rules: Rules[];
    rulesAI: string;
    excludedNum: number;
    clustersNum: number;
}
