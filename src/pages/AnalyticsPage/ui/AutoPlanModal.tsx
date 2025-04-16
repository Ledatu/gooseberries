import {Button, Card, Icon, Modal, Text, TextInput} from '@gravity-ui/uikit';
import {CloudArrowUpIn, TrashBin} from '@gravity-ui/icons';
import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {autoPlanModalStore} from '@/pages/AnalyticsPage/stores';

interface AutoPlanModalProps {
    planModalOpenFromEntity: string;
    planModalPlanValue: any;
    getPlanDay: any;
    planModalKey: any;
    setPlanModalPlanValue: any;
    handleSetPlanButton: any;
    handleDeletePlansButton: any;
}

export const AutoPlanModal: FC<AutoPlanModalProps> = observer(
    ({
        planModalOpenFromEntity,
        planModalPlanValue,
        getPlanDay,
        planModalKey,
        setPlanModalPlanValue,
        handleDeletePlansButton,
        handleSetPlanButton,
    }) => {
        const {
            planModalOpen,
            setPlanModalOpen,
            graphModalTitle,
            setGraphModalTitle,
            planModalPlanValueValid,
            setPlanModalPlanValueValid,
        } = autoPlanModalStore;

        if (!planModalOpen) {
            return null;
        }

        return (
            <Modal
                open={planModalOpen}
                onClose={() => {
                    setPlanModalOpen(false);
                    setGraphModalTitle('');
                }}
            >
                <Card
                    view="outlined"
                    // theme="warning"
                    style={{
                        padding: 20,
                        width: '40em',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            margin: '0px 32px',
                        }}
                        variant="display-1"
                    >
                        {`Установить план ${graphModalTitle} для ${planModalOpenFromEntity}`}
                    </Text>
                    <div style={{minHeight: 8}} />
                    <TextInput
                        hasClear
                        size="l"
                        value={planModalPlanValue}
                        validationState={planModalPlanValueValid ? undefined : 'invalid'}
                        onUpdate={(val) => {
                            const temp = Number(val != '' ? val : 'ahui');
                            setPlanModalPlanValueValid(!isNaN(temp) && isFinite(temp));
                            setPlanModalPlanValue(val);
                        }}
                        note={
                            planModalPlanValueValid && planModalPlanValue != '' ? (
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <Text variant="subheader-1">
                                        {`Ежедневный план для ${graphModalTitle} -> `}
                                    </Text>
                                    <div style={{minWidth: 4}} />
                                    <Text variant="subheader-1" color="brand">
                                        {new Intl.NumberFormat('ru-RU').format(
                                            getPlanDay(planModalKey),
                                        )}
                                    </Text>
                                </div>
                            ) : (
                                ''
                            )
                        }
                        style={{width: 'calc(100% - 32px)'}}
                        placeholder={`Введите план "${graphModalTitle}" на текущий месяц`}
                    />
                    <div style={{minHeight: 8}} />
                    <Button
                        disabled={!planModalPlanValueValid}
                        view="outlined-success"
                        size="l"
                        style={{margin: '4px'}}
                        onClick={handleSetPlanButton}
                    >
                        <Icon data={CloudArrowUpIn} />
                        Установить план
                    </Button>
                    <Button
                        disabled={!planModalPlanValueValid}
                        view="outlined-danger"
                        size="l"
                        style={{margin: '4px'}}
                        onClick={handleDeletePlansButton}
                    >
                        <Icon data={TrashBin} />
                        Удалить план
                    </Button>
                </Card>
            </Modal>
        );
    },
);
