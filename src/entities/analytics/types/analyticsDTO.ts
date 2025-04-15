import {AnalyticInfo} from './analyticInfo';

export type AnalyticDateInfo = Record<string, AnalyticInfo>;

export type AnalyticSubShop = Record<string, AnalyticDateInfo>;

export type AnalyticShop = Record<string, AnalyticSubShop>;

export type AnalyticDTO = {
    analyticsData: Record<string, AnalyticShop | undefined>;
    plansData: any;
};
