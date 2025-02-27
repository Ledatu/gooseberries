import {Card, Text} from '@gravity-ui/uikit';
import {Summary} from '@/shared/types/summary';
import {CSSProperties, FC} from 'react';

interface StatisticsCardProps {
    summary: Summary;
    val_key: keyof Summary;
    placeholder: string;
    cardStyle: CSSProperties;
    valueType?: 'text';
    percent?: boolean;
    rub?: boolean;
}

export const StatisticsCard: FC<StatisticsCardProps> = ({
    summary,
    rub,
    cardStyle,
    valueType,
    percent,
    placeholder,
    val_key,
}) => {
    return (
        <Card style={cardStyle} view="outlined">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Text
                    style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}
                >{`${placeholder}`}</Text>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: '18pt',
                        marginBottom: 10,
                        marginTop: 4,
                    }}
                >
                    {/*{10 ** Math.floor(Math.random() * 15)}*/}
                    {valueType == 'text'
                        ? summary[val_key]
                        : new Intl.NumberFormat('ru-RU').format(summary[val_key] as any)}
                    {percent ? '%' : ''}
                    {rub ? ' ₽' : ''}
                </Text>
            </div>
        </Card>
    );
};
