import {Button, Modal, TextArea} from '@gravity-ui/uikit';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import {motion} from 'framer-motion';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';

export const AnswerFeedbackModal = ({children, id, sellerId, setData}) => {
    const {userInfo} = useUser();
    const {user} = userInfo;

    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [textValid, setTextValid] = useState(true);
    const handleOpen = () => {
        setOpen(true);
        setText('');
        setTextValid(true);
    };
    const handleClose = () => setOpen(false);

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
                    animate={{height: open ? 236 : 0}}
                >
                    <TextArea
                        autoFocus
                        placeholder="Введите ваш ответ"
                        size="l"
                        rows={10}
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
                                seller_id: sellerId,
                                user_id: user?._id,
                                username: user?.username,
                                id: id,
                                text: text,
                            };
                            console.log(new Date(), 'answerFeedback', params);
                            callApi('answerFeedback', params)
                                .then(() => {
                                    setData((old) =>
                                        old ? old.filter((item) => item.id != id) : [],
                                    );
                                })
                                .catch((e) => {
                                    alert(e);
                                })
                                .finally(() => {
                                    setOpen(false);
                                });
                        }}
                    >
                        Отправить ответ
                    </Button>
                </motion.div>
            </Modal>
        </div>
    );
};
