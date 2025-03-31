import {Button, Card, Icon, List, Text} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Check} from '@gravity-ui/icons';

export const ChangeTemplateTab = () => {
    const {templatesNames, template, changeTemplate} = useAdvertsWordsModal();
    const [clickedItem, setClickedItem] = useState<string>('');
    useEffect(() => {
        console.log('clickedItem', clickedItem);
    }, [clickedItem]);
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: '95%', padding: 32}}>
            <List
                items={templatesNames}
                itemsHeight={500}
                itemHeight={36}
                filterPlaceholder={`Поиск в ${templatesNames.length} шаблонах`}
                onItemClick={(item) => {
                    const isSelected = item === template.name;
                    if (isSelected) return;
                    const isClicked = item === clickedItem;
                    console.log(item);
                    setClickedItem(isClicked ? '' : item);
                }}
                renderItem={(item) => {
                    const isClicked = item === clickedItem;
                    const isSelected = item === template.name;
                    return (
                        <Card
                            style={{
                                height: 32,
                                width: '100%',
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                            view="outlined"
                        >
                            <Text
                                color={isSelected ? 'positive-heavy' : undefined}
                                style={{margin: 8}}
                            >
                                {item}
                            </Text>
                            {isClicked ? (
                                <motion.div
                                    style={{margin: 4, opacity: 1, left: 0}}
                                    animate={{
                                        opacity: isClicked ? 1 : 0,
                                        left: isClicked ? undefined : -50,
                                    }}
                                >
                                    <Text style={{margin: 8}}>Вы хотите сменить шаблон?</Text>
                                    <Button
                                        view="flat-success"
                                        onClick={() => changeTemplate(item)}
                                    >
                                        <Icon data={Check} />
                                    </Button>
                                </motion.div>
                            ) : (
                                <div></div>
                            )}
                        </Card>
                    );
                }}
            />
        </div>
    );
};
