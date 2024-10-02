import {Button, Icon, Link, List, Modal, Text, TextArea, TextInput} from '@gravity-ui/uikit';
import {Plus, ListCheck, TrashBin, CloudArrowUpIn} from '@gravity-ui/icons';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import callApi, {getUid} from 'src/utilities/callApi';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';

export const AutoFeedbackTemplateCreationModal = ({selectValue, setRefetch}) => {
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

    const [useTags, setUseTags] = useState(false);
    const [selectedTags, setSelectedTags] = useState([] as string[]);
    const [availableTagsPending, setAvailableTagsPending] = useState(false);
    const [availableTags, setAvailableTags] = useState([] as any[]);
    const [availableTagsFiltered, setAvailableTagsFiltered] = useState([] as any[]);

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
                setAvailableTagsFiltered(tags ?? []);
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
        setUseTags(false);
        setUseWordsFilter(false);
        setSelectedTags([] as any[]);
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
                            <Button
                                pin="circle-circle"
                                selected={useTags}
                                view="outlined-info"
                                onClick={() => setUseTags(!useTags)}
                            >
                                Привязать теги
                            </Button>
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
                                            useTags,
                                            useWordsFilter,
                                            containsWords,
                                            doNotContainWords,
                                            selectedTags,
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
                            width: useTags ? 250 : 0,
                            left: useTags ? 358 : 350,
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
                            items={availableTags}
                            onFilterEnd={({items}) => {
                                setAvailableTagsFiltered(items);
                            }}
                            renderItem={(item) => {
                                return (
                                    <Button
                                        size="xs"
                                        pin="circle-circle"
                                        selected={selectedTags.includes(item)}
                                        view={
                                            selectedTags.includes(item)
                                                ? 'outlined-info'
                                                : 'outlined'
                                        }
                                    >
                                        {item.toUpperCase()}
                                    </Button>
                                );
                            }}
                            onItemClick={(item) => {
                                let tempArr = Array.from(selectedTags);
                                if (tempArr.includes(item)) {
                                    tempArr = tempArr.filter((value) => value != item);
                                } else {
                                    tempArr.push(item);
                                }

                                setSelectedTags(tempArr);
                            }}
                        />
                        <Button
                            style={{margin: 8}}
                            view={
                                selectedTags.length == availableTagsFiltered.length
                                    ? 'outlined-danger'
                                    : 'outlined-info'
                            }
                            selected={selectedTags.length == availableTagsFiltered.length}
                            onClick={() => {
                                setSelectedTags(
                                    selectedTags.length == availableTagsFiltered.length
                                        ? ([] as any[])
                                        : availableTagsFiltered,
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
                                        selectedTags.length == availableTagsFiltered.length
                                            ? TrashBin
                                            : ListCheck
                                    }
                                />
                                <div style={{minWidth: 3}} />
                                {selectedTags.length == availableTagsFiltered.length
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
