import {CSSProperties, FC} from 'react';
import {Card, Text} from '@gravity-ui/uikit';

type CardEntity = {
    value: string | number;
    placeholder: string;
    valueType?: string;
    percent?: boolean;
    rub?: boolean;
};

interface StatisticsCardProps {
    cardStyle: CSSProperties;
    entity1: CardEntity;
    entity2: CardEntity;
}

export const StatisticsCard: FC<StatisticsCardProps> = ({cardStyle, entity1, entity2}) => {
    return (
        <Card style={cardStyle} view="outlined">
            <div
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em'}}
            >
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{whiteSpace: 'pre-wrap', textAlign: 'center', fontSize: '15px'}}>
                        {entity1.placeholder}
                    </Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: '18pt',
                            marginTop: 8,
                        }}
                    >
                        {entity2.valueType === 'text'
                            ? entity1.value
                            : new Intl.NumberFormat('ru-RU').format(entity1.value as any)}
                        {entity1.percent ? '%' : ''}
                        {entity1.rub ? ' ₽' : ''}
                    </Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}>
                        {entity2.placeholder}
                    </Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: '18pt',
                            marginTop: 8,
                        }}
                    >
                        {entity2.valueType === 'text'
                            ? entity2.value
                            : new Intl.NumberFormat('ru-RU').format(entity2.value as any)}
                        {entity2.percent ? '%' : ''}
                        {entity2.rub ? ' ₽' : ''}
                    </Text>
                </div>
            </div>
        </Card>
    );
};
