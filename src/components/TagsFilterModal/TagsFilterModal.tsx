'use client';

import {Button, Card, Icon, Modal, Text, TextInput} from '@gravity-ui/uikit';
import {Tag} from '@gravity-ui/icons';
import {useState} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';
import {motion} from 'framer-motion';

export const TagsFilterModal = ({filterByButton}: any) => {
    const {availableTags, availableTagsPending} = useCampaign();

    const [tagsModalOpen, setTagsModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState('');

    return (
        <div>
            <Button
                style={{cursor: 'pointer'}}
                view="action"
                size="l"
                loading={availableTagsPending}
                onClick={async () => {
                    setFilterValue('');
                    setTagsModalOpen(true);
                }}
            >
                <Icon data={Tag} />
                <Text variant="subheader-1">Теги</Text>
            </Button>
            <Modal
                open={tagsModalOpen}
                onClose={() => {
                    setTagsModalOpen(false);
                }}
            >
                <Card
                    view="clear"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%',
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        style={{
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#221d220f',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        {availableTagsPending ? (
                            <div></div>
                        ) : (
                            <div
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 16,
                                    width: '70vw',
                                    height: '70vh',
                                }}
                            >
                                <TextInput
                                    placeholder={`Поиск среди ${availableTags.length} тегов`}
                                    style={{marginBottom: 16}}
                                    size="xl"
                                    value={filterValue}
                                    onUpdate={(val) => {
                                        setFilterValue(val);
                                    }}
                                />
                                <div
                                    style={{
                                        overflow: 'auto',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        width: '100%',
                                        gap: 16,
                                    }}
                                >
                                    {availableTags
                                        .filter((item: any) =>
                                            item
                                                ?.toLocaleLowerCase()
                                                ?.includes(filterValue?.toLocaleLowerCase()),
                                        )
                                        .map((item: any) => {
                                            return (
                                                <Button
                                                    onClick={() => {
                                                        filterByButton(item);
                                                        setTagsModalOpen(false);
                                                    }}
                                                    size="l"
                                                    pin="circle-circle"
                                                    selected
                                                    view={'outlined-info'}
                                                >
                                                    {item ? (item as string)?.toUpperCase() : ''}
                                                </Button>
                                            );
                                        })}
                                </div>
                                <Text style={{marginTop: 16}} variant="body-2" color="secondary">
                                    Добавлять и редактировать теги вы можете в модуле Товары
                                </Text>
                            </div>
                        )}
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
