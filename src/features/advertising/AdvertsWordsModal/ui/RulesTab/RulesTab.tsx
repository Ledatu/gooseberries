import {Button, Divider, Icon, Select, Text} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {rules} from '../../config/rules';
import {useMemo, useState} from 'react';
import {Plus} from '@gravity-ui/icons';
import {RuleItem} from './RuleItem';
import {FixedPhrasesTab} from '../FixedPhrasesTab';
import {useUser} from '@/components/RequireAuth';

export const RulesTab = () => {
    const {userInfo} = useUser();
    const {user} = userInfo ?? {};

    const {template, setTemplate} = useAdvertsWordsModal();
    const [currentRules, setCurrentRules] = useState<Rules[]>(template.rules);
    const [selectValue, setSelectValue] = useState('ctr');

    const changeRule = (currentRule: Rules, index: number) => {
        console.log('changeru', currentRule, index);
        if (index !== undefined) {
            const newRules = [...currentRules];
            newRules[index] = currentRule;

            setCurrentRules(newRules);

            setTemplate({...template, rules: newRules});
        }
    };

    const deleteRule = (ruleToDelete: Rules) => {
        const newRules = currentRules.filter(
            (rule) => !(JSON.stringify(rule) === JSON.stringify(ruleToDelete)),
        );
        setCurrentRules(newRules);

        setTemplate({...template, rules: newRules});
    };

    const admin = useMemo(
        () => [1122958293, 933839157, 566810027, 78342325].includes(user?._id),
        [user],
    );

    const {rulesAI} = template;
    const toogleAI = (version: string) => {
        setTemplate({...template, rulesAI: rulesAI == version ? '' : version});
    };

    return (
        <div
            style={{
                marginTop: 24,
                display: 'flex',
                flexDirection: 'row',
                gap: 16,
                width: '100%',
                height: '100%',
                marginLeft: 16,
                marginRight: 16,
            }}
        >
            <div style={{gap: 16, minWidth: '60%'}}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 8,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text variant="header-2">Добавить фильтр</Text>
                        {admin ? (
                            <Button
                                size="l"
                                pin="circle-circle"
                                selected={rulesAI !== ''}
                                onClick={() => toogleAI('AURUMSKYNET AI фильтр')}
                            >
                                Включить автоматическую фильтрацию AURUMSKYNET AI
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                        <Select
                            width={'max'}
                            placeholder={'Выберите фильтр'}
                            options={rules}
                            defaultValue={['ctr']}
                            onUpdate={(key) => {
                                setSelectValue(key[0]);
                            }}
                        />
                        <Button
                            onClick={() => {
                                const rules = [...currentRules];
                                rules.push({
                                    key: selectValue,
                                    val: 0,
                                    viewsThreshold: 0,
                                    biggerOrEqual: false,
                                    thresholdKey: 'views',
                                });
                                setCurrentRules(rules);
                            }}
                        >
                            <Icon data={Plus} />
                        </Button>
                    </div>
                    <Text variant="header-1">Исключать кластер</Text>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        marginTop: 16,
                        height: 'calc(100% - 270px)',
                        overflow: 'auto',
                    }}
                >
                    {currentRules.map((rule, index) => (
                        <RuleItem
                            rule={rule}
                            changeRule={(rule) => changeRule(rule, index)}
                            deleteRule={deleteRule}
                        />
                    ))}
                </div>
            </div>
            <Divider orientation="vertical" />
            <div style={{width: 'calc(40% - 64px)'}}>
                <FixedPhrasesTab />
            </div>
        </div>
    );
};
