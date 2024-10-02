import {
    Button,
    Icon,
    Link,
    List,
    Modal,
    Select,
    Text,
    TextArea,
    TextInput,
} from '@gravity-ui/uikit';
import {Plus, ListCheck, TrashBin, CloudArrowUpIn} from '@gravity-ui/icons';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import callApi, {getUid} from 'src/utilities/callApi';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';

export const AutoFeedbackTemplateCreationModal = ({sellerId, selectValue, setRefetch}) => {
    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const [templateName, setTemplateName] = useState('');
    const [ratingFrom, setRatingFrom] = useState('1');
    const [ratingTo, setRatingTo] = useState('5');
    const [templateText, setTemplateText] = useState('');

    const [selectedButton, setSelectedButton] = useState('');

    const [useWordsFilter, setUseWordsFilter] = useState(false);
    const [containsTextInput, setContainsTextInput] = useState('');
    const [containsWords, setContainsWords] = useState([] as string[]);
    const [doNotContainTextInput, setDoNotContainTextInput] = useState('');
    const [doNotContainWords, setDoNotContainWords] = useState([] as string[]);

    const [artsData, setArtsData] = useState({});
    const getArtsData = async () => {
        if (sellerId == '') setArtsData({});
        const params = {seller_id: sellerId, key: 'byNmId'};
        const artsDataTemp = await callApi('getArtsData', params).catch((e) => {
            console.log(e);
        });
        console.log('getArtsData', params, artsDataTemp);
        if (artsDataTemp && artsDataTemp['data']) setArtsData(artsDataTemp['data']);
        else setArtsData({});
    };
    useEffect(() => {
        getArtsData();
    }, [sellerId]);

    const bindingOptions = [
        {value: 'none', content: 'Задать параметры'},
        {value: 'brand', content: 'Бренд'},
        {value: 'object', content: 'Тип предмета'},
        {value: 'title', content: 'Наименование'},
        {value: 'imtId', content: 'ID КТ'},
        {value: 'art', content: 'Артикул'},
        {value: 'tags', content: 'Теги'},
    ];
    const [binding, setBinding] = useState(['none']);
    const [availableTagsPending, setAvailableTagsPending] = useState(false);
    const [availableTags, setAvailableTags] = useState([] as any[]);
    const [bindingKeys, setBindingKeys] = useState([] as any[]);
    const [availableBindingKeys, setAvailableBindingKeys] = useState([] as any[]);
    const [availableBindingKeysFiltered, setAvailableBindingKeysFiltered] = useState([] as any[]);

    useEffect(() => {
        if (binding[0] == 'tags') setAvailableBindingKeys(availableTags);
        else {
            const uniqueKeys = [] as string[];
            if (artsData)
                for (const [_, artData] of Object.entries(artsData)) {
                    if (!artData) continue;
                    const val = artData[binding[0]];
                    if (!uniqueKeys.includes(val)) uniqueKeys.push(val);
                }
            setAvailableBindingKeys(uniqueKeys);
            setAvailableBindingKeysFiltered(uniqueKeys);
        }
        setBindingKeys([]);
    }, [binding, artsData]);

    useEffect(() => {
        setAvailableTagsPending(true);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selectValue[0],
        })
            .then((res) => {
                if (!res) throw 'no response';
                const {tags} = res['data'] ?? {};
                tags.sort();
                setAvailableTags(tags ?? []);
                setBindingKeys(tags ?? []);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setAvailableTagsPending(false);
            });
    }, [selectValue]);

    const textAreaRef = useRef(null as unknown as HTMLTextAreaElement);

    const infoText = useMemo(() => {
        const str =
            'Используйте замены: {имя} - имя покупателя, {товар} - название товара, {артикул} - артикул товара, {бренд} - название бренда, {текст1|текст2|текст3} - случайный вариант текста из списка.';
        const nodes = str.split(' ') as any[];
        for (let i = 0; i < nodes.length; i++) {
            const word = nodes[i];
            if (word[0] == '{')
                nodes[i] = (
                    <Link
                        onClick={() => {
                            setTemplateText((val) => (val.trim() + ' ' + word).trim());
                            textAreaRef?.current?.focus();
                        }}
                    >
                        {word}
                    </Link>
                );
        }
        const temp = [] as any[];
        for (const node of nodes) {
            temp.push(node);
            temp.push(<div style={{minWidth: 4}} />);
        }
        return temp;
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setTemplateName('');
        setRatingFrom('1');
        setRatingTo('5');
        setBinding(['none']);
        setUseWordsFilter(false);
        setBindingKeys([] as any[]);
        setAvailableBindingKeys([] as any[]);
        setAvailableBindingKeysFiltered([] as any[]);
        setContainsWords([]);
        setDoNotContainWords([]);
        setContainsTextInput('');
        setDoNotContainTextInput('');
        setTemplateText('');
    };
    const handleClose = () => {
        setOpen(false);
        setCurrentStep(0);
        setRefetch((cur) => !cur);
    };

    return (
        <div>
            <Button size="l" onClick={handleOpen} view="action">
                <Icon data={Plus} />
                <Text variant="subheader-1">Добавить шаблон</Text>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                style={{display: 'flex', flexDirection: 'column'}}
            >
                <motion.div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        position: 'relative',
                    }}
                >
                    <motion.div
                        animate={{
                            width: useWordsFilter ? 250 : 0,
                            left: useWordsFilter ? -258 : 0,
                            top: 22,
                        }}
                        style={{
                            position: 'absolute',
                            background: 'var(--g-color-base-background)',
                            borderRadius: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            width: 0,
                            height: 550,
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', height: '50%'}}>
                            <TextInput
                                placeholder="Отзыв должен содержать"
                                note={
                                    containsWords.length ? undefined : '*После ввода нажмите Enter'
                                }
                                size="l"
                                value={containsTextInput}
                                onUpdate={(val) => {
                                    setContainsTextInput(val);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = e.currentTarget.value;
                                        if (val == '') return;
                                        setContainsWords((cur) => {
                                            const temp = [...cur];
                                            if (!temp.includes(val)) temp.push(val);
                                            return temp;
                                        });
                                        setContainsTextInput('');
                                    }
                                }}
                            />
                            <List
                                filterable={false}
                                items={containsWords}
                                onItemClick={(item) => {
                                    setContainsWords((cur) => {
                                        return cur.filter((it) => item != it);
                                    });
                                }}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', height: '50%'}}>
                            <TextInput
                                placeholder="Отзыв не должен содержать"
                                note={
                                    doNotContainWords.length
                                        ? undefined
                                        : '*После ввода нажмите Enter'
                                }
                                size="l"
                                value={doNotContainTextInput}
                                onUpdate={(val) => {
                                    setDoNotContainTextInput(val);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = e.currentTarget.value;
                                        if (val == '') return;
                                        setDoNotContainWords((cur) => {
                                            const temp = [...cur];
                                            if (!temp.includes(val)) temp.push(val);
                                            return temp;
                                        });
                                        setDoNotContainTextInput('');
                                    }
                                }}
                            />
                            <List
                                filterable={false}
                                items={doNotContainWords}
                                onItemClick={(item) => {
                                    setDoNotContainWords((cur) => {
                                        return cur.filter((it) => item != it);
                                    });
                                }}
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            minWidth: 350,
                            maxWidth: 350,
                        }}
                    >
                        <motion.div
                            style={{
                                height: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                            animate={{
                                height: open ? 36 : 0,
                                marginBottom: open && currentStep ? 8 : 0,
                            }}
                        >
                            <TextInput
                                autoFocus
                                placeholder="Введите название шаблона"
                                size="l"
                                value={templateName}
                                onUpdate={(val) => {
                                    setTemplateName(val);
                                    if (val != '' && currentStep == 0) setCurrentStep(1);
                                }}
                            />
                        </motion.div>
                        <motion.div
                            style={{
                                height: 0,
                                display: 'flex',
                                flexDirection: 'row',
                                overflow: 'hidden',
                                alignItems: 'center',
                            }}
                            animate={{
                                height: open && currentStep ? 36 : 0,
                                marginBottom: open && currentStep ? 8 : 0,
                            }}
                        >
                            <Text
                                style={{margin: '0 8px', whiteSpace: 'nowrap'}}
                                variant="subheader-2"
                            >
                                Оценки от:
                            </Text>
                            <TextInput
                                placeholder=""
                                size="l"
                                value={ratingFrom}
                                onUpdate={(val) => {
                                    setRatingFrom(val);
                                }}
                            />
                            <Text style={{margin: '0 8px'}} variant="subheader-2">
                                до:
                            </Text>
                            <TextInput
                                placeholder=""
                                size="l"
                                value={ratingTo}
                                onUpdate={(val) => {
                                    setRatingTo(val);
                                }}
                            />
                        </motion.div>
                        <motion.div
                            style={{
                                maxHeight: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                alignItems: 'center',
                            }}
                            animate={{
                                maxHeight: open && currentStep ? 600 : 0,
                                marginBottom: open && currentStep ? 8 : 0,
                            }}
                        >
                            <TextArea
                                controlRef={textAreaRef}
                                value={templateText}
                                onUpdate={(val) => {
                                    setTemplateText(val);
                                }}
                                minRows={20}
                                maxRows={30}
                                note={`${templateText.length} / 1000`}
                                validationState={
                                    templateText.length <= 1000 ? undefined : 'invalid'
                                }
                            />
                            <Text
                                variant="code-inline-1"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    padding: 8,
                                }}
                            >
                                {infoText}
                            </Text>
                        </motion.div>
                        <motion.div
                            style={{
                                maxHeight: 0,
                                display: 'flex',
                                flexDirection: 'row',
                                overflow: 'hidden',
                                alignItems: 'center',
                                padding: '0 8px',
                                width: '100%',
                                flexWrap: 'wrap',
                            }}
                            animate={{
                                maxHeight: open && currentStep ? 600 : 0,
                                marginBottom: open && currentStep ? 8 : 0,
                            }}
                        >
                            <Button
                                pin="circle-circle"
                                selected={useWordsFilter}
                                view="outlined-utility"
                                onClick={() => setUseWordsFilter(!useWordsFilter)}
                            >
                                Добавить фильтр слова
                            </Button>
                            <div style={{minWidth: 8}} />
                            <Select
                                value={selectValue}
                                placeholder="Values"
                                options={bindingOptions}
                                renderControl={({onClick, onKeyDown, ref}) => {
                                    const map = {
                                        none: 'Задать параметры',
                                        brand: 'Бренд',
                                        object: 'Тип предмета',
                                        title: 'Наименование',
                                        imtId: 'ID КТ',
                                        art: 'Артикул',
                                        tags: 'Теги',
                                    };
                                    return (
                                        <Button
                                            selected={
                                                binding[0] != 'none' && bindingKeys.length > 0
                                            }
                                            view={'outlined-info'}
                                            pin={'circle-circle'}
                                            ref={ref}
                                            onClick={onClick}
                                            extraProps={{
                                                onKeyDown,
                                            }}
                                        >
                                            {map[binding[0]]}
                                        </Button>
                                    );
                                }}
                                onUpdate={(nextValue) => {
                                    setBinding(nextValue);
                                }}
                            />
                        </motion.div>
                        {generateModalButtonWithActions(
                            {
                                disabled: templateName == '' || templateText == '',
                                placeholder: 'Сохранить',
                                icon: CloudArrowUpIn,
                                view: 'outlined-success',
                                onClick: () => {
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            templateName,
                                            templateText,
                                            useWordsFilter,
                                            containsWords,
                                            doNotContainWords,
                                            binding: binding[0],
                                            bindingKeys,
                                            ratingFrom,
                                            ratingTo,
                                        },
                                    };
                                    callApi('saveAutoFeedbacksTemplate', params).finally(
                                        handleClose,
                                    );
                                },
                            },
                            selectedButton,
                            setSelectedButton,
                        )}
                    </motion.div>
                    <motion.div
                        animate={{
                            width: binding[0] != 'none' ? 250 : 0,
                            left: binding[0] != 'none' ? 358 : 350,
                            top: 22,
                        }}
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            height: 550,
                            left: 350,
                            flexDirection: 'column',
                            width: 0,
                            overflow: 'hidden',
                            background: 'var(--g-color-base-background)',
                            borderRadius: 8,
                        }}
                    >
                        <List
                            size="l"
                            loading={availableTagsPending}
                            filterPlaceholder="Введите имя тега"
                            emptyPlaceholder="Такой тег отсутствует"
                            items={availableBindingKeys}
                            onFilterEnd={({items}) => {
                                setAvailableBindingKeysFiltered(items);
                            }}
                            renderItem={(item) => {
                                return (
                                    <Button
                                        size="xs"
                                        pin="circle-circle"
                                        selected={bindingKeys.includes(item)}
                                        view={
                                            bindingKeys.includes(item)
                                                ? 'outlined-info'
                                                : 'outlined'
                                        }
                                    >
                                        {item}
                                    </Button>
                                );
                            }}
                            onItemClick={(item) => {
                                let tempArr = Array.from(bindingKeys);
                                if (tempArr.includes(item)) {
                                    tempArr = tempArr.filter((value) => value != item);
                                } else {
                                    tempArr.push(item);
                                }

                                setBindingKeys(tempArr);
                            }}
                        />
                        <Button
                            style={{margin: 8}}
                            view={
                                availableBindingKeysFiltered.length == bindingKeys.length
                                    ? 'outlined-danger'
                                    : 'outlined-info'
                            }
                            selected={availableBindingKeysFiltered.length == bindingKeys.length}
                            onClick={() => {
                                setBindingKeys(
                                    availableBindingKeysFiltered.length == bindingKeys.length
                                        ? ([] as any[])
                                        : availableBindingKeysFiltered,
                                );
                            }}
                            pin="circle-circle"
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                <Icon
                                    data={
                                        bindingKeys.length == availableBindingKeysFiltered.length
                                            ? TrashBin
                                            : ListCheck
                                    }
                                />
                                <div style={{minWidth: 3}} />
                                {bindingKeys.length == availableBindingKeysFiltered.length
                                    ? 'Очистить'
                                    : `Выбрать все`}
                            </div>
                        </Button>
                    </motion.div>
                </motion.div>
            </Modal>
        </div>
    );
};
