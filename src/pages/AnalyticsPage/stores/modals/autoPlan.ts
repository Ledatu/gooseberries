import {makeAutoObservable} from 'mobx';

class AnalyticsModalStore {
    private planModalOpen_: boolean = false;
    private graphModalTitle_: string = '';
    private planModalPlanValueValid_: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    public get planModalOpen(): boolean {
        return this.planModalOpen_;
    }

    public get graphModalTitle(): string {
        return this.graphModalTitle_;
    }

    public get planModalPlanValueValid(): boolean {
        return this.planModalPlanValueValid_;
    }

    public setPlanModalOpen = (value: boolean) => {
        if (value === this.planModalOpen_) {
            return;
        }
        this.planModalOpen_ = value;
    };

    public setGraphModalTitle = (value: string) => {
        if (this.graphModalTitle_ === value) {
            return;
        }
        this.graphModalTitle_ = value;
    };

    public setPlanModalPlanValueValid = (value: boolean) => {
        if (this.planModalPlanValueValid_ === value) {
            return;
        }
        this.planModalPlanValueValid_ = value;
    };
}

export const autoPlanModalStore: AnalyticsModalStore = new AnalyticsModalStore();
