export interface AutoPhrasesTemplate {
    name: string;
    isFixed: boolean;
    sellerId: string;
    phrasesSelectedByPlus: string[];
    phrasesExcludedByMinus: string[];
    fixedClusters: string[];
    viewsThreshold: number;
    selectedByAutoPhrases: string[];
    includes: string[];
    notIncludes: string[];
    rules: Rules[];
    rulesAI: string;
    clustersNum: number;
    excludedNum: number;
}

export function AutoPhrasesTemplateMapper(
    templateDto: AutoPhrasesTemplateDto,
): AutoPhrasesTemplate {
    return {
        name: templateDto.name,
        isFixed: templateDto.isFixed,
        sellerId: templateDto.seller_id,
        includes: templateDto.includes,
        notIncludes: templateDto.notIncludes,
        rules: templateDto.rules,
        rulesAI: templateDto.rulesAI ?? '',
        selectedByAutoPhrases: templateDto.selectedByAutoPhrases,
        viewsThreshold: templateDto.viewsThreshold,
        phrasesExcludedByMinus: templateDto.phrasesExcludedByMinus,
        phrasesSelectedByPlus: templateDto.phrasesSelectedByPlus,
        fixedClusters: templateDto.fixedClusters || [],
        excludedNum: templateDto.excludedNum,
        clustersNum: templateDto.clustersNum,
    };
}
