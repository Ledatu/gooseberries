import {Button, Divider, Icon, Select, Text} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {rules} from '../../config/rules';
import {useState} from 'react';
import {Plus} from '@gravity-ui/icons';
import {RuleItem} from './RuleItem';
import {FixedPhrasesTab} from '../FixedPhrasesTab';

export const RulesTab = () => {
    const {template, setTemplate} = useAdvertsWordsModal();
    const [currentRules, setCurrentRules] = useState<Rules[]>(template.rules);
    const [selectValue, setSelectValue] = useState('ctr');

    const changeRule = (currentRule: Rules, index: number) => {
        console.log('changeru', currentRule, index);
        if (index !== undefined) {
            const newRules = [...currentRules];
            newRules[index] = currentRule;

            setCurrentRules(newRules);

            setTemplate({...template, rules: currentRules});
        }
    };

    const deleteRule = (ruleToDelete: Rules) => {
        const newRules = currentRules.filter(
            (rule) => !(JSON.stringify(rule) === JSON.stringify(ruleToDelete)),
        );
        setCurrentRules(newRules);

        setTemplate({...template, rules: currentRules});
    };

    return (
        <div
            style={{
                marginTop: 24,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 16,
            }}
        >
            <div style={{gap: 16, width: '50%'}}>
                <div
                    style={{
                        display: 'flex',
                        // width: '%',
                        flexDirection: 'column',
                        gap: 16,
                        // padding: 16,
                    }}
                >
                    <Text variant="header-1">Добавить фильтр</Text>
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
                                });
                                setCurrentRules(rules);
                            }}
                        >
                            <Icon data={Plus} />
                        </Button>
                    </div>
                    <Text variant="header-1">Исключать кластер</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16}}>
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
            <FixedPhrasesTab />
        </div>
    );
};
