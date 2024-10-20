import {Button, Card, Icon, List, Modal, Text, TextInput} from '@gravity-ui/uikit';
import {Tag} from '@gravity-ui/icons';
import React, {useState} from 'react';
import {useCampaign} from 'src/contexts/CampaignContext';
import {motion} from 'framer-motion';

export const TagsFilterModal = ({filterByButton}) => {
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
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '30vw',
                                    height: '60vh',
                                }}
                            >
                                <TextInput
                                    placeholder={`Поиск среди ${availableTags.length} тегов`}
                                    style={{marginBottom: 8}}
                                    size="l"
                                    value={filterValue}
                                    onUpdate={(val) => {
                                        setFilterValue(val);
                                    }}
                                />
                                <List
                                    filterable={false}
                                    emptyPlaceholder="Такой тег отсутствует"
                                    loading={availableTagsPending}
                                    items={availableTags.filter((item) =>
                                        item
                                            .toLocaleLowerCase()
                                            .includes(filterValue.toLocaleLowerCase()),
                                    )}
                                    itemHeight={36}
                                    renderItem={(item) => {
                                        return (
                                            <Button
                                                size="m"
                                                pin="circle-circle"
                                                selected
                                                view={'outlined-info'}
                                            >
                                                {item ? (item as string).toUpperCase() : ''}
                                            </Button>
                                        );
                                    }}
                                    onItemClick={(item) => {
                                        filterByButton(item);
                                        setTagsModalOpen(false);
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
