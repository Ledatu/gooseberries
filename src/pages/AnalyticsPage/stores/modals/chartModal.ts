import {makeAutoObservable} from 'mobx';

class ChartModal {
    private graphModalOpen_: boolean = false;
    private currentGraphMetrics_: any = [];
    private graphModalData_: any = {};
    private graphModalTimeline_: any = [];

    constructor() {
        makeAutoObservable(this);
    }

    public get graphModalOpen(): boolean {
        return this.graphModalOpen_;
    }

    public get currentGraphMetrics(): any {
        return this.currentGraphMetrics_;
    }

    public get graphModalData(): any {
        return this.graphModalData_;
    }

    public get graphModalTimeline(): any {
        return this.graphModalTimeline_;
    }

    public setGraphModalOpen = (value: boolean) => {
        if (this.graphModalOpen_ === value) {
            return;
        }
        this.graphModalOpen_ = value;
    };

    public setCurrentGraphMetrics = (value: any) => {
        if (this.currentGraphMetrics_ === value) {
            return;
        }
        this.currentGraphMetrics_ = value;
    };

    public setGraphModalData = (value: any): void => {
        if (this.graphModalData_ === value) {
            return;
        }
        this.graphModalData_ = value;
    };

    public setGraphModalTimeline = (value: any): void => {
        if (this.graphModalTimeline_ === value) {
            return;
        }
        this.graphModalTimeline_ = value;
    };
}

export const chartModalStore: ChartModal = new ChartModal();
