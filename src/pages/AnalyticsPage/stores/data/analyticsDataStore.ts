import {makeAutoObservable} from 'mobx';

class AnalyticsDataStore {
    private allData: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public getDataToShow() {
        return this.allData;
    }

    public setAllData = (data: any[]) => {
        this.allData = data;
    };

    public get data() {
        return this.allData;
    }
}

export const analyticsDataStore = new AnalyticsDataStore();
