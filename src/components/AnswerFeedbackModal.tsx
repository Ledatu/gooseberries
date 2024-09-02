import {Button, Icon, Modal, TextArea} from '@gravity-ui/uikit';
import {PencilToLine} from '@gravity-ui/icons';
import React, {useState} from 'react';
import {motion} from 'framer-motion';
import callApi, {getUid} from 'src/utilities/callApi';

export const AnswerFeedbackModal = ({selectValue, id}) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [textValid, setTextValid] = useState(true);
    const handleOpen = () => {
        setOpen(true);
        setText('');
        setTextValid(true);
    };
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen} size="xs">
                Добавить ответ
                <Icon data={PencilToLine} />
            </Button>
            <Modal open={open} onClose={handleClose}>
                <motion.div
                    style={{
                        overflow: 'hidden',
                        height: 0,
                        width: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        alignItems: 'center',
                    }}
                    animate={{height: open ? 396 : 0}}
                >
                    <TextArea
                        placeholder="Введите ваш ответ"
                        size="l"
                        rows={20}
                        validationState={textValid ? undefined : 'invalid'}
                        value={text}
                        onUpdate={(val) => {
                            setTextValid(val.length <= 1000);
                            setText(val);
                        }}
                        note={`${text.length} / 1000`}
                    />
                    <Button
                        disabled={!textValid}
                        width="max"
                        view="flat-success"
                        selected
                        size="l"
                        onClick={() => {
                            const params = {
                                uid: getUid(),
                                campaignName: selectValue[0],
                                id: id,
                                text: text,
                            };
                            callApi('answerFeedback', params);
                        }}
                    >
                        Сохранить ответ
                    </Button>
                </motion.div>
            </Modal>
        </div>
    );
};
