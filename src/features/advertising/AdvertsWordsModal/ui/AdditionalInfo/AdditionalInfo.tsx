import {Button, Text, Card, Divider} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useEffect, useState} from 'react';

export const AdditionalInfoTab = () => {
    const {template, advertId} = useAdvertsWordsModal();
    const [alert, setAlert] = useState<boolean>(false);
    useEffect(() => {
        if (template.excludedNum >= 1000) {
            setAlert(true);
        } else {
            setAlert(false);
        }
    }, [template, advertId]);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 16,
                paddingBottom: 8,
                gap: 16,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    marginInline: 8,
                }}
            >
                <Button
                    size="l"
                    pin="circle-circle"
                    selected
                    view={'outlined-success'}
                    style={{paddingInline: 16}}
                >
                    <Text>{advertId}</Text>
                </Button>
                <Button
                    size="l"
                    pin="circle-circle"
                    selected
                    view={'outlined-info'}
                    style={{paddingInline: 16}}
                >
                    <Text>{template.name}</Text>
                </Button>
            </div>
            {alert ? (
                <Card
                    size="m"
                    view="filled"
                    theme="danger"
                    style={{
                        borderRadius: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowWrap: 'break-word',
                        // maxWidth: '80%',
                        maxWidth: '100%',
                        // flexGrow: 1,
                        color: 'rgb(232, 71, 109)',
                        padding: 16,
                        marginInline: 8,
                        gap: 8,
                        // background: 'rgba(229, 50, 93, 0.2)',
                    }}
                    // maxWidth={550}
                >
                    <Text variant="body-1">
                        {
                            'Исключению подлежит более 1000 фраз, что невозможно из-за ограничений установленных WB. Пожалуйста пересоздайте рекламную компанию или измените фильтры'
                        }
                    </Text>
                </Card>
            ) : (
                <></>
            )}
            <Divider orientation="horizontal" />
        </div>
    );
};
