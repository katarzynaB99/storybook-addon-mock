import React, { useEffect } from 'react';
import { useAddonState, useChannel, useParameter } from '@storybook/api';
import { AddonPanel, Placeholder, ScrollArea } from '@storybook/components';

import { ADDON_ID, EVENTS, PARAM_KEY } from './utils/constants';
import faker from './utils/faker';

import { MockItem } from './components/MockItem';

export const Panel = (props) => {
    const [mockData, setState] = useAddonState(ADDON_ID, []);

    const paramData = useParameter(PARAM_KEY, []);

    const emit = useChannel({
        [EVENTS.SEND]: (newMockData) => {
            setState(newMockData);
        },
        [EVENTS.UPDATE]: (item, name, value) => {
            faker.update(item, name, value);
            emit(EVENTS.SEND, faker.getRequests());
        },
    });

    useEffect(() => {
        faker.makeInitialRequestMap(paramData);
        emit(EVENTS.SEND, faker.getRequests());
    }, [paramData]);

    const onChange = (item, name, value) => {
        emit(EVENTS.UPDATE, item, name, value);
    };

    if (!mockData || mockData.length === 0) {
        return (
            <AddonPanel {...props}>
                <Placeholder>No mock data found.</Placeholder>
            </AddonPanel>
        );
    }

    return (
        <AddonPanel {...props}>
            <ScrollArea>
                {mockData.map((item, index) => {
                    // eslint-disable-next-line no-unused-vars
                    const { searchParamKeys, path, ...rest } = item;
                    return (
                        <MockItem
                            key={index}
                            onChange={(name, value) =>
                                onChange(item, name, value)
                            }
                            {...rest}
                        />
                    );
                })}
            </ScrollArea>
        </AddonPanel>
    );
};
