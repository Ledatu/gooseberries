import {Button, Icon, Select, Spin, Text} from '@gravity-ui/uikit';
import {Key, ChevronDown} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React from 'react';
import {User} from 'src/pages/Dashboard';

export const SelectCampaign = ({
    userInfo,
    selectOptions,
    selectValue,
    setSelectValue,
    switchingCampaignsFlag,
    setSwitchingCampaignsFlag,
}: {
    userInfo: User;
    selectOptions: any[];
    selectValue: string[];
    setSelectValue: Function;
    switchingCampaignsFlag: boolean;
    setSwitchingCampaignsFlag: Function;
}) => {
    console.log(userInfo);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Select
                value={selectValue}
                placeholder="Values"
                options={selectOptions}
                renderControl={({onClick, onKeyDown, ref}) => {
                    return (
                        <Button
                            loading={switchingCampaignsFlag}
                            ref={ref}
                            size="l"
                            onClick={onClick}
                            extraProps={{
                                onKeyDown,
                            }}
                        >
                            <Icon data={Key} />
                            <Text variant="subheader-1">{selectValue[0]}</Text>
                            <Icon data={ChevronDown} />
                        </Button>
                    );
                }}
                onUpdate={(nextValue) => {
                    setSwitchingCampaignsFlag(true);
                    setSelectValue(nextValue);
                }}
            />
            <motion.div
                style={{
                    overflow: 'hidden',
                    marginTop: 4,
                }}
                animate={{
                    maxWidth: switchingCampaignsFlag ? 40 : 0,
                    opacity: switchingCampaignsFlag ? 1 : 0,
                }}
            >
                <Spin style={{marginLeft: 8}} />
            </motion.div>
        </div>
    );
};
