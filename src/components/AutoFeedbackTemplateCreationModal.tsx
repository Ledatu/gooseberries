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
    Card,
} from '@gravity-ui/uikit';
import {ListCheck, TrashBin, CloudArrowUpIn, Star, StarFill} from '@gravity-ui/icons';
import React, {
    Children,
    isValidElement,
    ReactElement,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {motion} from 'framer-motion';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';
import {useCampaign} from 'src/contexts/CampaignContext';
import ApiClient from 'src/utilities/ApiClient';

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
    const [templateText, setTemplateText] = useState('');

    const [selectedButton, setSelectedButton] = useState('');

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
    // const generateRates = (
    //     num: number,
    //     func: React.Dispatch<React.SetStateAction<string>>,
    //     filter: string,
    // ) => {
    //     const stars: React.JSX.Element[] = [];
    //     for (let i = 1; i <= num; i++) {
    //         stars.push(
    //             <Button
    //                 view="flat"
    //                 onClick={() => func(String(i))}
    //                 style={{color: 'rgb(255, 190, 92)'}}
    //             >
    //                 <Icon data={Number(filter) >= i ? StarFill : Star} />
    //             </Button>,
    //         );
    //     }
    //     return stars;
    // };

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
        setTemplateName(templateValues?.name ?? '');
        if (templateValues?.name != '') setCurrentStep(1);
        setRatingFrom(templateValues?.ratingFrom ?? '1');
        setRatingTo(templateValues?.ratingTo ?? '5');
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
        setRefetch((cur) => !cur);
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

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <div>
            {triggerButton}
            <Modal
                open={open}
                onClose={handleClose}
                style={{display: 'flex', flexDirection: 'column'}}
            >
                <Card
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)', // Corrected 'translate' to 'transform'
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center', // Vertically center within the Card
                        justifyContent: 'center', // Horizontally center within the Card
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        <motion.div
                            animate={{
                                width: useWordsFilter ? 250 : 0,
                                left: useWordsFilter ? -258 : 0,
                                top: '10%',
                                opacity: useWordsFilter ? 1 : 0,
                            }}
                            style={{
                                position: 'absolute',
                                background: '#221d220f',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '#0002 0px 2px 8px 0px',
                                borderRadius: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                width: 0,
                                height: 550,
                                overflow: 'hidden',
                                border: '1px solid #eee2',
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
                                    renderItem={(item) => {
                                        return <Text style={{margin: '8px'}}>{item}</Text>;
                                    }}
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                minWidth: 400,
                                maxWidth: 400,
                                background: '#221d220f',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '#0002 0px 2px 8px 0px',
                                border: '1px solid #eee2',
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
                            {/* <motion.div
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
                                    Оценки от:
                                </Text>
                                {generateRates(5, setRatingFrom, ratingFrom)}
                            </motion.div> */}
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
                                {/* <div style={{margin: '4px'}}>
                                    <Select
                                        options={productValuations}
                                        placeholder="Описание проблемы товара"
                                        width={'max'}
                                        onUpdate={(value) => {
                                            setCurrentProductValuations(Number(value));
                                        }}
                                    />
                                </div> */}
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
                                    justifyContent: 'center',
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
                                            art: 'Артикул продавца',
                                            nmId: 'Артикул WB',
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
                                        setBindingKeys([]);
                                        setBinding(nextValue);
                                    }}
                                />
                            </motion.div>
                            {generateModalButtonWithActions(
                                {
                                    disabled:
                                        templateName == '' ||
                                        (templateText == '' &&
                                            currentFeedbackValuations == 0 &&
                                            currentProductValuations == 0) ||
                                        !starsButtonsState.includes(true),
                                    // currentFeedbackValuations == 0 &&
                                    // currentProductValuations == 0
                                    placeholder: 'Сохранить',
                                    icon: CloudArrowUpIn,
                                    view: 'outlined-success',
                                    onClick: () => {
                                        const params = {
                                            seller_id: sellerId,
                                            data: {
                                                templateName,
                                                templateText,
                                                useWordsFilter,
                                                containsWords,
                                                doNotContainWords,
                                                binding: binding[0],
                                                isReport:
                                                    currentFeedbackValuations ||
                                                    currentProductValuations,
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
                                        ApiClient.post(
                                            'buyers/save-auto-feedbacks-template',
                                            params,
                                        ).finally(handleClose);
                                    },
                                },
                                selectedButton,
                                setSelectedButton,
                            )}
                        </motion.div>
                        <motion.div
                            animate={{
                                width: binding[0] != 'none' ? 250 : 0,
                                left: binding[0] != 'none' ? 408 : 350,
                                opacity: binding[0] != 'none' ? 1 : 0,
                                top: '10%',
                            }}
                            style={{
                                background: '#221d220f',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '#0002 0px 2px 8px 0px',
                                border: '1px solid #eee2',
                                display: 'flex',
                                position: 'absolute',
                                height: 550,
                                left: 408,
                                flexDirection: 'column',
                                width: 0,
                                overflow: 'hidden',
                                // background: 'var(--g-color-base-background)',
                                borderRadius: 8,
                            }}
                        >
                            <List
                                size="l"
                                loading={availableTagsPending}
                                filterPlaceholder={`Поиск`}
                                emptyPlaceholder="Нет результатов"
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
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
