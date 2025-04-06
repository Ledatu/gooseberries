'use client';

import {Button, Icon, List, Select, Text, TextArea, TextInput} from '@gravity-ui/uikit';
import {ListCheck, TrashBin, CloudArrowUpIn, Star, StarFill} from '@gravity-ui/icons';
import {
    Children,
    isValidElement,
    ReactElement,
    useEffect,
    useMemo,
    useRef,
    useState,
    cloneElement,
} from 'react';
import {motion} from 'framer-motion';
// import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';
import {useCampaign} from '@/contexts/CampaignContext';
import ApiClient from '@/utilities/ApiClient';
import {ModalWindow} from '@/shared/ui/Modal';
import {CheckTemplateModal} from './CheckTemplateModal';

interface AutoFeedbackTemplateCreationModalInterface {
    children: ReactElement | ReactElement[];
    sellerId: string;
    setRefetch: Function;
    artsData: any;
    feedbackValuations: any;
    templateValues?: any;
}

export const AutoFeedbackTemplateCreationModal = ({
    children,
    sellerId,
    artsData,
    feedbackValuations,
    setRefetch,
    templateValues,
}: AutoFeedbackTemplateCreationModalInterface) => {
    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const [templateName, setTemplateName] = useState('');
    const [ratingFrom, setRatingFrom] = useState('1');
    const [ratingTo, setRatingTo] = useState('5');
    const [templateText, setTemplateText] = useState<string>(templateValues?.text ?? '');

    // const [selectedButton, setSelectedButton] = useState('');

    const [useWordsFilter, setUseWordsFilter] = useState(false);
    const [containsTextInput, setContainsTextInput] = useState('');
    const [containsWords, setContainsWords] = useState([] as string[]);
    const [doNotContainTextInput, setDoNotContainTextInput] = useState('');
    const [doNotContainWords, setDoNotContainWords] = useState([] as string[]);
    const [reportReview, setReportReview] = useState(false);
    const [starsButtonsState, setStarsButtonsState] = useState<Boolean[]>([false]);

    // const [productValuations, setProductValuations] = useState([] as any[]);
    const [currentProductValuations, setCurrentProductValuations] = useState(0);
    const [currentFeedbackValuations, setCurrentFeedbackValuations] = useState(0);

    const bindingOptions = [
        {value: 'none', content: 'Задать параметры'},
        {value: 'brand', content: 'Бренд'},
        {value: 'object', content: 'Тип предмета'},
        {value: 'title', content: 'Наименование'},
        {value: 'imtId', content: 'ID КТ'},
        {value: 'art', content: 'Артикул продавца'},
        {value: 'nmId', content: 'Артикул WB'},
        {value: 'tags', content: 'Теги'},
    ];
    const [binding, setBinding] = useState(['none']);
    const [bindingKeys, setBindingKeys] = useState([] as any[]);
    const [availableBindingKeys, setAvailableBindingKeys] = useState([] as any[]);
    const [availableBindingKeysFiltered, setAvailableBindingKeysFiltered] = useState([] as any[]);
    const [userRatings, setUserRatings] = useState<Number[]>([]);

    const {availableTags, availableTagsPending, selectValue} = useCampaign();

    useEffect(() => {
        setStarsButtonsState([false, false, false, false, false]);
    }, []);
    const genarateRatesButtons = (
        num: number,
        buttonsState: Boolean[],
        setButtonsState: React.Dispatch<React.SetStateAction<Boolean[]>>,
    ) => {
        const stars: React.JSX.Element[] = [];
        for (let i = 1; i <= num; i++) {
            stars.push(
                <Button
                    view="flat"
                    onClick={() => {
                        const buttonsStateNew = [...buttonsState];
                        buttonsStateNew[i - 1] = !buttonsState[i - 1];
                        console.log(buttonsStateNew);
                        setButtonsState(buttonsStateNew);
                    }}
                    style={{color: 'rgb(255, 190, 92)'}}
                >
                    <Text>{i}</Text>
                    <Icon data={buttonsState[i - 1] ? StarFill : Star} />
                </Button>,
            );
        }
        return stars;
    };

    useEffect(() => {
        if (binding[0] == 'tags') setAvailableBindingKeys(availableTags);
        else {
            const uniqueKeys = [] as string[];
            if (artsData)
                for (const [_, data] of Object.entries(artsData)) {
                    if (!data) continue;
                    const artData: any = data;
                    const val = artData[binding[0]];
                    if (!uniqueKeys.includes(val)) uniqueKeys.push(val);
                }
            setAvailableBindingKeys(uniqueKeys);
            setAvailableBindingKeysFiltered(uniqueKeys);
        }
    }, [binding, artsData]);

    useEffect(() => {
        const temp: Number[] = [];
        for (let i = 0; i < starsButtonsState.length; i++) {
            if (starsButtonsState[i]) {
                temp.push(i + 1);
            }
        }
        setUserRatings(temp);
    }, [starsButtonsState]);
    const textAreaRef = useRef(null as unknown as HTMLTextAreaElement);

    const infoText = useMemo(() => {
        const str =
            'Используйте замены: {имя} - имя покупателя, {товар} - название товара, {бренд} - название бренда, {текст1|текст2|текст3} - случайный вариант текста из списка.';
        const nodes = str.split(' ') as any[];
        for (let i = 0; i < nodes.length; i++) {
            const word = nodes[i];
            if (word[0] == '{')
                nodes[i] = (
                    <Text
                        color="brand"
                        className="g-link g-link_view_primary"
                        onClick={() => {
                            setTemplateText((val) => (val.trim() + ' ' + word).trim());
                            textAreaRef?.current?.focus();
                        }}
                    >
                        {word}
                    </Text>
                );
        }
        const temp = [] as any[];
        for (const node of nodes) {
            temp.push(node);
            temp.push(<div style={{minWidth: 4}} />);
        }
        return temp;
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setTemplateText(templateValues?.text ?? '');
        }, 200);
    }, [templateValues, open]);

    const handleOpen = () => {
        console.log(templateValues);

        setOpen(true);
        setTemplateName(templateValues?.name ?? '');
        if (templateValues?.name != '') setCurrentStep(1);
        setRatingFrom(templateValues?.ratingFrom ?? '1');
        setRatingTo(templateValues?.ratingTo ?? '5');
        setUserRatings(templateValues?.ratings ?? []);
        const stars = [false, false, false, false, false];
        for (const rating of templateValues?.ratings ?? []) {
            stars[rating - 1] = true;
        }
        setStarsButtonsState(stars);
        setBinding(templateValues?.binding ? [templateValues?.binding] : ['none']);
        setUseWordsFilter(templateValues?.contains?.length || templateValues?.doNotContain?.length);
        setBindingKeys(templateValues?.bindingKeys ?? []);
        setAvailableBindingKeys([] as any[]);
        setAvailableBindingKeysFiltered([] as any[]);
        setContainsWords(templateValues?.contains ?? []);
        setDoNotContainWords(templateValues?.doNotContain ?? []);
        setContainsTextInput('');
        setDoNotContainTextInput('');
        setTemplateText(templateValues?.text ?? '');
    };
    const handleClose = () => {
        setOpen(false);
        setCurrentStep(0);
        setRefetch((cur: boolean) => !cur);
    };

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const handleSaveButton = () => {
        const params = {
            seller_id: sellerId,
            data: {
                templateName,
                templateText,
                useWordsFilter,
                containsWords,
                doNotContainWords,
                binding: binding[0],
                isReport: currentFeedbackValuations || currentProductValuations,
                supplierFeedbackValuation: currentFeedbackValuations
                    ? currentFeedbackValuations
                    : undefined,
                supplierProductValuation: currentProductValuations
                    ? currentProductValuations
                    : undefined,
                bindingKeys,
                ratingFrom,
                ratingTo,
                ratings: userRatings,
            },
        };
        console.log(params, 'params');
        ApiClient.post('buyers/save-auto-feedbacks-template', params).finally(handleClose);
    };

    useEffect(() => {
        console.log(availableBindingKeys);
    }, [binding]);

    return (
        <div>
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <div style={{display: 'flex', flexDirection: 'row', gap: 16}}>
                    {!useWordsFilter ? (
                        <></>
                    ) : (
                        <motion.div
                            exit={{opacity: 0}}
                            animate={{opacity: 1}}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: 550,
                                minWidth: 250,
                            }}
                        >
                            <div style={{display: 'flex', flexDirection: 'column', height: '50%'}}>
                                <TextInput
                                    placeholder="Отзыв должен содержать"
                                    note={
                                        containsWords.length
                                            ? undefined
                                            : '*После ввода нажмите Enter'
                                    }
                                    size="l"
                                    value={containsTextInput ?? ''}
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
                                    items={containsWords ?? []}
                                    onItemClick={(item) => {
                                        setContainsWords((cur) => {
                                            return cur.filter((it) => item != it);
                                        });
                                    }}
                                    renderItem={(item) => {
                                        return <Text style={{margin: '8px'}}>{item}</Text>;
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
                                    value={doNotContainTextInput ?? ''}
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
                                    items={doNotContainWords ?? []}
                                    onItemClick={(item) => {
                                        setDoNotContainWords((cur) => {
                                            return cur.filter((it) => item != it);
                                        });
                                    }}
                                    renderItem={(item) => {
                                        return <Text style={{margin: '8px'}}>{item}</Text>;
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                    <div style={{display: 'flex', flexDirection: 'column', width: 550}}>
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
                                justifyContent: 'center',
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
                                Оценки:
                            </Text>
                            {genarateRatesButtons(5, starsButtonsState, setStarsButtonsState)}
                        </motion.div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: '8px',
                                alignSelf: 'center',
                                // alignContent: 'center',
                            }}
                        >
                            <Button
                                selected={reportReview}
                                onClick={() => {
                                    setReportReview(!reportReview);
                                    setCurrentFeedbackValuations(0);
                                    setCurrentProductValuations(0);
                                }}
                            >
                                Отправлять жалобу
                            </Button>
                        </div>
                        <motion.div
                            style={{
                                maxHeight: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                alignItems: 'center',
                            }}
                            animate={{
                                maxHeight: open && currentStep && reportReview ? 600 : 0,
                                marginBottom: open && currentStep && reportReview ? 8 : 0,
                            }}
                        >
                            <div style={{margin: '4px'}}>
                                <Select
                                    options={feedbackValuations}
                                    placeholder="Причина жалобы на отзыв"
                                    onUpdate={(value) => {
                                        setCurrentFeedbackValuations(Number(value));
                                        console.log(currentFeedbackValuations);
                                    }}
                                />
                            </div>
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
                                minHeight: open && currentStep ? 420 : 0,
                                marginBottom: open && currentStep ? 8 : 0,
                            }}
                        >
                            <TextArea
                                controlRef={textAreaRef}
                                value={templateText ?? undefined}
                                onUpdate={(val) => {
                                    setTemplateText(val);
                                }}
                                rows={20}
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
                                justifyContent: 'center',
                                padding: '0 8px',
                                width: '100%',
                                flexWrap: 'wrap',
                                gap: 8,
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
                            <Select
                                value={selectValue}
                                placeholder="Values"
                                options={bindingOptions}
                                renderControl={({triggerProps: {onClick, onKeyDown}}) => {
                                    const map: any = {
                                        none: 'Задать параметры',
                                        brand: 'Бренд',
                                        object: 'Тип предмета',
                                        title: 'Наименование',
                                        imtId: 'ID КТ',
                                        art: 'Артикул продавца',
                                        nmId: 'Артикул WB',
                                        tags: 'Теги',
                                    };
                                    return (
                                        <Button
                                            selected={
                                                binding[0] != 'none' && bindingKeys.length > 0
                                            }
                                            // ref={ref as Ref<HTMLButtonElement>}
                                            view={'outlined-info'}
                                            pin={'circle-circle'}
                                            // ref={ref}
                                            onClick={onClick}
                                            onKeyDown={onKeyDown}
                                            // extraProps={{
                                            //     onKeyDown,
                                            // }}
                                        >
                                            {map[binding[0]]}
                                        </Button>
                                    );
                                }}
                                onUpdate={(nextValue) => {
                                    setBindingKeys([]);
                                    setBinding(nextValue);
                                }}
                            />
                            <CheckTemplateModal
                                template={{
                                    templateName,
                                    templateText,
                                    useWordsFilter,
                                    containsWords,
                                    doNotContainWords,
                                    binding: binding[0],
                                    isReport: currentFeedbackValuations || currentProductValuations,
                                    supplierFeedbackValuation: currentFeedbackValuations
                                        ? currentFeedbackValuations
                                        : undefined,
                                    supplierProductValuation: currentProductValuations
                                        ? currentProductValuations
                                        : undefined,
                                    bindingKeys,
                                    ratingFrom,
                                    ratingTo,
                                    ratings: userRatings,
                                }}
                            >
                                <Button
                                    disabled={
                                        templateName == '' ||
                                        (templateText == '' &&
                                            currentFeedbackValuations == 0 &&
                                            currentProductValuations == 0) ||
                                        !starsButtonsState.includes(true)
                                    }
                                    pin="circle-circle"
                                    selected
                                    view="action"
                                >
                                    Проверить шаблон на отзыве
                                </Button>
                            </CheckTemplateModal>
                        </motion.div>
                        <Button
                            disabled={
                                templateName == '' ||
                                (templateText == '' &&
                                    currentFeedbackValuations == 0 &&
                                    currentProductValuations == 0) ||
                                !starsButtonsState.includes(true)
                            }
                            view="outlined-success"
                            size="l"
                            style={{margin: '4px'}}
                            onClick={handleSaveButton}
                        >
                            <Icon data={CloudArrowUpIn} />
                            Сохранить
                        </Button>
                    </div>
                    {binding[0] == 'none' ||
                    !availableBindingKeys ||
                    !availableBindingKeys?.length ? (
                        <></>
                    ) : (
                        <motion.div
                            exit={{opacity: 0}}
                            animate={{opacity: 1}}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: 550,
                                minWidth: 250,
                            }}
                        >
                            <List
                                size="l"
                                loading={availableTagsPending}
                                filterPlaceholder={`Поиск`}
                                emptyPlaceholder="Нет результатов"
                                items={availableBindingKeys.filter((i) => i !== undefined)}
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
                                            bindingKeys.length ==
                                            availableBindingKeysFiltered.length
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
                    )}
                </div>
            </ModalWindow>
        </div>
    );
};
