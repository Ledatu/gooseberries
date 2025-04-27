import {Button, Divider, Icon, Select, Text} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {rules} from '../../config/rules';
import {useState} from 'react';
import {Plus} from '@gravity-ui/icons';
import {RuleItem} from './RuleItem';
import {FixedPhrasesTab} from '../FixedPhrasesTab';
import {AnimatePresence} from 'framer-motion';

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
            setTemplate({...template, rules: newRules});
        }
    };

    const addRule = () => {
        const rules = [...currentRules];
        rules.push({
            key: selectValue,
            val: 0,
            viewsThreshold: 0,
            biggerOrEqual: false,
            thresholdKey: 'views',
        });
        setCurrentRules(rules);
        setTemplate({...template, rules: rules});
    };

    const deleteRule = (ruleToDelete: Rules) => {
        const newRules = currentRules.filter(
            (rule) => !(JSON.stringify(rule) === JSON.stringify(ruleToDelete)),
        );
        setCurrentRules(newRules);

        setTemplate({...template, rules: newRules});
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
                                addRule();
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
                    <AnimatePresence>
                        {currentRules.map((rule, index) => (
                            <RuleItem
                                rule={rule}
                                changeRule={(rule) => changeRule(rule, index)}
                                deleteRule={deleteRule}
                                key={`rules_item_${index}`}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            <Divider orientation="vertical" />
            <div style={{width: 'calc(40% - 64px)'}}>
                <FixedPhrasesTab />
            </div>
        </div>
    );
};
