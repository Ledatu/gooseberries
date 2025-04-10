import {Button, Icon, NumberInput, Text} from '@gravity-ui/uikit';
import {getNameOfRule} from '../../config/rules';
import {TrashBin} from '@gravity-ui/icons';

interface templateItem {
    rule: Rules;
    changeRule: (rule: Rules) => void;
    deleteRule: (rule: Rules) => void;
    // buttonAdd? : boolean
}

export const RuleItem = ({rule, changeRule, deleteRule}: templateItem) => {
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 12,
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                }}
            >
                <Text variant="subheader-2">Если просмотров больше или равно</Text>
                <NumberInput
                    style={{width: 100}}
                    value={rule.viewsThreshold}
                    onUpdate={(value) => {
                        const newRule = {...rule};
                        newRule.viewsThreshold = value ?? 0;
                        changeRule(newRule);
                        // setNewRule(rule);
                    }}
                />
                <Text
                    variant="subheader-2"
                    style={{width: 135}}
                >{`и ${getNameOfRule(rule.key)}`}</Text>
                <Button
                    selected={rule.biggerOrEqual}
                    view={'outlined'}
                    onClick={() => {
                        const newRule = {...rule};
                        newRule.biggerOrEqual = !newRule.biggerOrEqual;
                        console.log(newRule.biggerOrEqual);
                        changeRule(newRule);
                    }}
                >
                    <Text>{rule.biggerOrEqual ? 'больше' : 'меньше'}</Text>
                </Button>
                <NumberInput
                    step={0.1}
                    allowDecimal
                    style={{width: 100}}
                    value={rule.val}
                    onUpdate={(value) => {
                        const newRule = {...rule};
                        newRule.val = value ?? 0;
                        changeRule(newRule);
                    }}
                />
                <Text style={{width: 20}} variant="subheader-2">
                    {getNameOfRule(rule.key).split(', ')[1] ?? ''}
                </Text>
            </div>
            <Button
                onClick={() => {
                    deleteRule(rule);
                }}
            >
                <Icon data={TrashBin} />
            </Button>
        </div>
    );
};
