import {ActionTooltip, Button, Card, Divider, Icon, Label, TextArea} from '@gravity-ui/uikit';
import {Note, Color} from '../types';
// import ApiClient from '@/utilities/ApiClient';
import {colors} from '../config/colors';
import {motion} from 'framer-motion';
import {TrashBin, Check} from '@gravity-ui/icons';
// import {getLocaleDateString} from '@/utilities/getRoundValue';

import {cx} from '@/lib/utils';
import {SetColorButton} from './SetColorButton';

interface EditNoteForArtProps {
    note: Note;
    setNote: (note: Note) => void;
    deleteNote: (note: Note) => void;
    saveNote: (note: Note) => void;
}

export const NoteEditCard = ({
    note,
    setNote,
    deleteNote = (note: Note) => {
        note;
    },
    saveNote = (note: Note) => {
        note;
    },
}: EditNoteForArtProps) => {
    // const {sellerId} = useCampaign();
    // const getNoteInfo = async () => {
    //     try {
    //         const params = {id: id, seller_id: sellerId};
    //         const res = await ApiClient.post('massAdvert/notes/getFullNote', params);
    //         console.log(res);
    //         if (!res || !res.data || !res.data) {
    //             throw new Error(`Error while getting full note for ${id}`);
    //         }
    //         console.log(res.data);
    //         setText(res.data.text);
    //         setCurrentColor(res.data.color);
    //         setDate(res.data.time);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const saveNote = async () => {
    //     try {
    //         const note: Note = {
    //             text: text,
    //             color: currentColor,
    //             seller_id: sellerId,
    //             nmId: nmId,
    //         };
    //         if (id) {
    //             note['id'] = id;
    //         }
    //         let params = {
    //             seller_id: sellerId,
    //             note: note,
    //         };
    //         const res = await ApiClient.post('massAdvert/notes/writeNote', params);
    //         console.log(res);
    //         if (!res) {
    //             throw new Error(`Error while saving note for ${id}`);
    //         }
    //     } catch (error) {
    //         console.error('error while insert note:', error);
    //     }
    // };

    // const deleteNote = async () => {
    //     try {
    //         const params = {seller_id: sellerId, id: id};
    //         const res = await ApiClient.post('massAdvert/notes/deleteNote', params);
    //         console.log('res deleting note', res);
    //     } catch (error) {
    //         console.error('Error while deleting note', error);
    //     }
    // };
    // const [noteInfo, setNoteInfo] = useState<Note>({} as Note);
    // const [currentColor, setCurrentColor] = useState<Color>(note.color);
    // useEffect(() => {
    //     if (open && id) {
    //         getNoteInfo();
    //     }
    // }, [open, id]);

    const generateButtonsForColor = () => {
        const buttons = Object.keys(colors).map((key: string) => {
            const color: Color = key as Color;
            const isSelect = color === note.color;

            return (
                <div style={{display: 'flex', flexDirection: 'column', margin: 0}}>
                    <SetColorButton
                        color={color}
                        setColor={(color) => {
                            setNote({...note, color: color});
                        }}
                        style={{height: '24px', width: '24px'}}
                    />
                    {isSelect ? (
                        <motion.div
                            layoutId="selectColor"
                            className={'select-color'}
                            style={{backgroundColor: colors[color] || 'white'}}
                        />
                    ) : undefined}
                </div>
            );
        });
        return (
            <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '8px'}}>
                {buttons}
            </div>
        );
    };
    return (
        <Card
            className={cx(['blurred-card'])}
            style={{display: 'flex', flexDirection: 'column', width: 576, height: 600}}
        >
            <Card
                view="clear"
                style={{
                    // height: '48px',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    // display: 'flex',
                    flexDirection: 'row',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }}
            >
                <div style={{display: 'flex', margin: 8, gap: 8}}>
                    <Label size="s" theme={note.color === 'positive' ? 'success' : note.color}>
                        {new Date(note.date).toLocaleDateString('Ru-ru')}
                    </Label>
                    <ActionTooltip title="Удалить заметку">
                        <Button
                            size="s"
                            view="flat-danger"
                            onClick={() => {
                                deleteNote(note);
                                // setOpen(false);
                            }}
                            disabled={note.id === undefined}
                        >
                            <Icon data={TrashBin} />
                        </Button>
                    </ActionTooltip>
                </div>
                {generateButtonsForColor()}
                <div
                    style={{
                        display: 'inline-flex',
                        gap: 8,
                        margin: 8,
                        alignItems: 'center',
                    }}
                >
                    {/* <Text color="secondary">
                            {new Date(note.date).toLocaleDateString('ru-RU')}
                        </Text> */}
                    <ActionTooltip title="Сохранить заметку">
                        <Button
                            size="s"
                            view="flat-success"
                            onClick={() => {
                                saveNote(note);
                            }}
                        >
                            <Icon data={Check} />
                        </Button>
                    </ActionTooltip>
                </div>
                {/* <div style={{margin: 4}}> */}
                {/* </div> */}
            </Card>
            <Divider />
            <TextArea
                view="clear"
                value={note.text}
                style={{width: 'auto', height: '100%', margin: 8}}
                onUpdate={(value: string) => {
                    setNote({...note, text: value});
                }}
            ></TextArea>
        </Card>
    );
};
