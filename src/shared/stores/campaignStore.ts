import {makeAutoObservable} from 'mobx';
import {Summary} from '@/shared/types/summary';

class CampaignStore {
    balance: {net: number; bonus: number; balance: number} = {
        net: 0,
        bonus: 0,
        balance: 0,
    };
    selectedNmId: number = 0;

    fetchingDataFromServerFlag: boolean = false;

    filters: Record<string, any> = {};
    filtersRK: Record<string, boolean> = {
        scheduleRules: false,
        budgetRules: false,
        phrasesRules: false,
        bidderRules: false,
        activeAdverts: false,
        pausedAdverts: false,
    };

    semanticsModalOpenFromArt: string = '';
    autoSalesModalOpenFromParent: string = '';

    copiedAdvertsSettings: {advertId: number} = {advertId: 0};

    summary: Summary = {
        views: 0,
        clicks: 0,
        sum: 0,
        drr_orders: 0,
        drr_sales: 0,
        drr: '',
        orders: 0,
        sales: 0,
        sum_orders: 0,
        sum_sales: 0,
        addToCartCount: 0,
        profit: '',
        rent: '',
        profitTemp: 0,
    };

    artsStatsByDayFilteredSummary: any = {
        date: 0,
        orders: 0,
        sum_orders: 0,
        avg_price: 0,
        sum: 0,
        views: 0,
        clicks: 0,
        drr: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        cr: 0,
        cpo: 0,
        openCardCount: 0,
        addToCartCount: 0,
        addToCartPercent: 0,
        cartToOrderPercent: 0,
        cpl: 0,
    };

    constructor() {
        makeAutoObservable(this);
    }

    setBalance(balance: {net: number; bonus: number; balance: number}) {
        this.balance = balance;
    }

    setArtsStatsByDayFilteredSummary(something: any) {
        this.artsStatsByDayFilteredSummary = something;
    }

    setSemanticsModalOpenFromArt(something: string) {
        this.semanticsModalOpenFromArt = something;
    }

    setAutoSalesModalOpenFromParent(something: string) {
        this.autoSalesModalOpenFromParent = something;
    }

    setFilters(filters: Record<string, any>) {
        this.filters = filters;
    }

    setFiltersRK(filtersRK: Record<string, boolean>) {
        this.filtersRK = filtersRK;
    }

    setSelectedNmId(abs: any) {
        this.selectedNmId = abs;
    }

    setCopiedAdvertsSettings(settings: {advertId: number}) {
        this.copiedAdvertsSettings = settings;
    }

    setSummary(summary: Summary) {
        this.summary = summary;
    }

    setFetchingDataFromServerFlag(flag: boolean) {
        this.fetchingDataFromServerFlag = flag;
    }
}

export const campaignStore = new CampaignStore();
