import {createContext, useContext, useEffect, useState} from 'react';
import {AdvertWordsTabModules} from '../types';
import {useCampaign} from '@/contexts/CampaignContext';
import {fetchClusterStats} from '../api/fetchClusterStats';
import {ClusterData} from '../api/mapper';
import {AutoPhrasesTemplate} from '../api/AutoPhrasesTemplateMapper';
import {fetchAutoPhrasesTemplate} from '../api/fetchAutoPhrasesTemplate';
import {getTemplateNames} from '../api/getTemplatesNames';
import {changeTemplateNameOfAdvert} from '../api/changeTemplateNameOfAdvert';
import {changeTemplateOfAdvert} from '../api/changeTemplateOfAdvert';
import {changeSelectedPhrase} from '../api/changeSelectedPhrase';
import {fetchSelectedPhrase} from '../api/fetchSelectedPhrase';
import {PhrasesStats} from '../api/PhraseStats';
import {useError} from '@/contexts/ErrorContext';
import {getWordsStatsForAdvert} from '../api/getWordsStatsForAdvert';

interface AutoWordsContextType {
    advertId: number;
    loading: boolean;
    currentModule: AdvertWordsTabModules;
    setCurrentModule: (module: AdvertWordsTabModules) => void;
    stats: ClusterData[];
    excluded: boolean;
    setExcluded: (arg: boolean) => void;
    template: AutoPhrasesTemplate;
    setTemplate: (arg: AutoPhrasesTemplate) => void;
    advertWordsTemplateHandler: AdvertWordsTemplateHandler;
    dates: Date[];
    setDates: (arg: Date[]) => void;
    startAdvert: Date;
    endAdvert: Date;
    saveTemplate: Function;
    templatesNames: string[];
    changeTemplate: (arg: string) => void;
    saveOpen: boolean;
    setSaveOpen: (arg: boolean) => void;
    updateSelectedPhrase: (phrase: string) => void;
    selectedPhrase: string;
    wordsStats: PhrasesStats[];
}

class AdvertWordsTemplateHandler {
    setTemplate: (arg: AutoPhrasesTemplate) => void;
    template: AutoPhrasesTemplate;
    constructor(setTemplate: (arg: AutoPhrasesTemplate) => void, template: AutoPhrasesTemplate) {
        this.setTemplate = setTemplate;
        this.template = template;
    }

    addIncludes = (phrase: string): void => {
        if (this.template.includes.includes(phrase)) return;
        const newTemplate = {...this.template};
        newTemplate.includes.push(phrase);
        this.setTemplate(newTemplate);
    };

    addNotIncludes = (phrase: string): void => {
        if (this.template.notIncludes.includes(phrase)) return;
        const newTemplate = {...this.template};
        newTemplate.notIncludes.push(phrase);
        this.setTemplate(newTemplate);
    };

    addRule = (rule: Rules): void => {
        const newTemplate = {...this.template};
        newTemplate.rules = newTemplate.rules.filter(
            (val) => val.key != rule.key && val.val != rule.val,
        );
        newTemplate.rules.push(rule);
        this.setTemplate(newTemplate);
    };

    deleteIncludes = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.includes = newTemplate.includes.filter((text) => text != phrase);
        this.setTemplate(newTemplate);
    };

    deleteNotIncludes = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.notIncludes = newTemplate.notIncludes.filter((text) => text != phrase);
        this.setTemplate(newTemplate);
    };
    addPhrasesExcludedByMinus = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.phrasesExcludedByMinus.push(phrase);
        this.setTemplate(newTemplate);
    };
    addPhrasesSelectedByPlus = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.phrasesSelectedByPlus.push(phrase);
        this.setTemplate(newTemplate);
    };
    deletePhrasesExcludedByMinus = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.phrasesExcludedByMinus = newTemplate.phrasesExcludedByMinus.filter(
            (text) => text != phrase,
        );
        this.setTemplate(newTemplate);
    };

    deletePhrasesSelectedByPlus = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.phrasesSelectedByPlus = newTemplate.phrasesSelectedByPlus.filter(
            (text) => text != phrase,
        );
        this.setTemplate(newTemplate);
    };
    addFixedPhrases = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.fixedClusters = newTemplate.fixedClusters.filter((text) => text != phrase);
        newTemplate.fixedClusters.push(phrase);
        this.setTemplate(newTemplate);
    };

    deleteFixedPhrases = (phrase: string): void => {
        const newTemplate = {...this.template};
        newTemplate.fixedClusters = newTemplate.fixedClusters.filter((text) => text != phrase);
        this.setTemplate(newTemplate);
    };
    changeName = (newName: string): void => {
        const newTemplate = {...this.template};
        newTemplate.name = newName;
        this.setTemplate(newTemplate);
    };
    changeRules = (rules: Rules[]): void => {
        const newTemplate = {...this.template};
        newTemplate.rules = rules;
        this.setTemplate(newTemplate);
    };
    deleteRule = (rule: Rules): void => {
        const newTemplate = {...this.template};
        newTemplate.rules = newTemplate.rules.filter(
            (val) => val.key != rule.key && val.val != rule.val,
        );
        this.setTemplate(newTemplate);
    };

    changeIsFixed = (isFixed: boolean): void => {
        const newTemplate = {...this.template};
        newTemplate.isFixed = isFixed;
        this.setTemplate(newTemplate);
    };
}
interface AdvertsWordsProviderProps {
    children: React.ReactNode;
    advertId: number;
    getNames: Function;
}
export const AutoWordsContext = createContext<AutoWordsContextType | undefined>(undefined);

export const useAdvertsWordsModal = () => {
    if (!AutoWordsContext) throw Error('No info in AutoWordsContext');
    return useContext(AutoWordsContext) as AutoWordsContextType;
};

export const AdvertWordsProvider = ({children, advertId, getNames}: AdvertsWordsProviderProps) => {
    const [stats, setStats] = useState<ClusterData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [excluded, setExcluded] = useState<boolean>(false);
    const [currentModule, setCurrentModule] = useState<AdvertWordsTabModules>('ActiveClusters');
    const [startAdvert, setStartAdvert] = useState<Date>(new Date());
    const [endAdvert, setEndAdvert] = useState<Date>(new Date());
    const {sellerId} = useCampaign();
    const [templatesNames, setTemplatesNames] = useState<string[]>([]);
    const [newTemplateName, setNewTemplateName] = useState<string>('');
    const [saveOpen, setSaveOpen] = useState<boolean>(false);
    const [selectedPhrase, setSelectedPhrase] = useState<string>('');
    const [wordsStats, setWordsStats] = useState<PhrasesStats[]>([]);
    const {showError} = useError();

    const getWordsStats = async () => {
        try {
            const res = await getWordsStatsForAdvert(sellerId, advertId);
            setWordsStats(res);
        } catch (error) {
            console.log(error);
            showError('Неудалось получить статистику по словам');
        }
    };

    useEffect(() => {
        console.log('selectedPhrase', selectedPhrase);
    }, [selectedPhrase]);

    useEffect(() => {
        if (newTemplateName != '') {
            changeTemplate(newTemplateName);
            setNewTemplateName('');
        }
        getNames();
    }, [newTemplateName]);

    useEffect(() => {
        if (currentModule === 'AutoPhrases') {
            getWordsStats();
            console.log('aaa');
        }
    }, [currentModule]);

    const [template, setTemplate] = useState<AutoPhrasesTemplate>({
        name: '',
        isFixed: false,
        sellerId: sellerId,
        includes: [],
        notIncludes: [],
        rules: [],
        phrasesSelectedByPlus: [],
        phrasesExcludedByMinus: [],
        viewsThreshold: 0,
        selectedByAutoPhrases: [],
        fixedClusters: [],
        clustersNum: 0,
        excludedNum: 0,
    });

    const [dates, setDates] = useState<Date[]>([new Date(), new Date()]);
    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        console.log('template', template);
    }, [template]);

    const advertWordsTemplateHandler = new AdvertWordsTemplateHandler(setTemplate, template);
    const getTemplate = async () => {
        const template = await fetchAutoPhrasesTemplate(advertId, sellerId);
        console.log(template);
        setTemplate(template);
    };
    const getSelectedPhrase = async () => {
        const selected = await fetchSelectedPhrase(sellerId, advertId);
        console.log(selected);
        setSelectedPhrase(selected);
    };

    const updateSelectedPhrase = (selectedPhrase: string) => {
        changeSelectedPhrase({seller_id: sellerId, advertId, selectedPhrase}).then(() =>
            getSelectedPhrase(),
        );
    };
    useEffect(() => {
        getTemplate();
        getSelectedPhrase();
        fetchTemplatesName();
    }, [advertId, sellerId]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const start = new Date(dates[0]);
            start.setHours(3, 0, 0, 0);
            const end = new Date(dates[1]);
            end.setHours(3, 0, 0, 0);
            console.log(start, end);
            const {clusterData, endTime, startTime} = await fetchClusterStats(
                advertId,
                sellerId,
                excluded,
                start,
                end,
            );
            console.log(clusterData, startTime, endTime);
            setStartAdvert(startTime);
            setEndAdvert(endTime);
            if (firstTime) {
                setDates([startTime, endTime]);
                setFirstTime(false);
            }

            setStats(clusterData);
            setLoading(false);
            console.log(dates);
        } catch (error) {
            console.error('Error while fetching cluster stats', error);
        }
    };
    const changeTemplate = async (templateName: string) => {
        try {
            const newTemplate = await changeTemplateNameOfAdvert({
                templateName: templateName,
                advertId: advertId,
                seller_id: sellerId,
            });
            if (!newTemplate) throw new Error('No template');
            setTemplate(newTemplate);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTemplatesName = async () => {
        try {
            const templates = await getTemplateNames(sellerId);
            setTemplatesNames(templates);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch data when advertId changes
    useEffect(() => {
        if (advertId !== null) {
            fetchStats();
        }
    }, [advertId, excluded, dates]); // Fetch only when advertId changes

    const saveTemplate = async (name?: string) => {
        console.log(template);
        const templeteToSend = {...template};
        if (name) {
            templeteToSend.name = name;
        }
        await changeTemplateOfAdvert({
            seller_id: sellerId,
            template: templeteToSend,
            advertId: advertId,
        });
        await fetchTemplatesName();
    };

    return (
        <AutoWordsContext.Provider
            value={{
                advertId,
                stats,
                loading,
                currentModule,
                setCurrentModule,
                excluded,
                setExcluded,
                template,
                setTemplate,
                dates,
                setDates,
                startAdvert,
                endAdvert,
                advertWordsTemplateHandler,
                saveTemplate,
                templatesNames,
                changeTemplate: setNewTemplateName,
                saveOpen,
                setSaveOpen,
                updateSelectedPhrase,
                selectedPhrase,
                wordsStats,
            }}
        >
            {children}
        </AutoWordsContext.Provider>
    );
};
