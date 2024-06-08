import React from 'react';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import block from 'bem-cn-lite';
import useWindowDimensions from 'src/hooks/useWindowDimensions';

import {CircleMinusFill, CircleMinus, CirclePlusFill, CirclePlus, Funnel} from '@gravity-ui/icons';
import {Button, DropdownMenu, Icon, TextInput, Text} from '@gravity-ui/uikit';

const b = block('the-table');

interface TheTableProps {
    columnData: any[];
    data: any[];
    filters: any;
    setFilters: (filters: any) => void;
    filterData: any;
    footerData?: any[];
    onRowClick?: (row: any, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
}

export const defaultRender = ({value}: {value?: any}, valueType = 'number') => {
    return typeof value === 'number' && valueType != 'text'
        ? new Intl.NumberFormat('ru-RU').format(value)
        : value;
};

export default function TheTable({
    columnData,
    data,
    filters,
    setFilters,
    filterData,
    footerData = [],
    onRowClick,
}: TheTableProps) {
    const generateColumns = (columnsInfo) => {
        const columns: Column<any>[] = [];
        if (!columnsInfo && !columnsInfo.length) return columns;
        const viewportSize = useWindowDimensions();

        for (let i = 0; i < columnsInfo.length; i++) {
            const column = columnsInfo[i];
            if (!column) continue;
            const {name, placeholder, width, render, className, valueType, additionalNodes} =
                column;

            columns.push({
                name: name,
                className: b(className ?? (i < 1 ? `td_fixed td_fixed_${name}` : 'td_body')),
                header: generateFilterTextInput({
                    filters,
                    setFilters,
                    filterData: filterData,
                    name,
                    placeholder,
                    valueType,
                    width,
                    viewportSize,
                    additionalNodes,
                }),
                render: render ? (args) => render(args) : (args) => defaultRender(args, valueType),
            });
        }

        return columns;
    };

    const columns = generateColumns(columnData);

    return (
        <div className={b()}>
            <DataTable
                startIndex={1}
                settings={{
                    stickyHead: MOVING,
                    stickyFooter: MOVING,
                    displayIndices: false,
                    highlightRows: true,
                }}
                theme="yandex-cloud"
                onRowClick={(row, index, event) => {
                    if (onRowClick) onRowClick(row, index, event);
                    else console.log(row);
                }}
                rowClassName={(_row, index, isFooterData) =>
                    isFooterData ? b('tableRow_footer') : b('tableRow_' + index)
                }
                data={data}
                columns={columns}
                footerData={footerData}
            />
        </div>
    );
}

const generateFilterTextInput = (args) => {
    const {
        filters,
        setFilters,
        filterData,
        name,
        placeholder,
        valueType,
        width,
        viewportSize,
        additionalNodes,
    } = args;
    let minWidth = viewportSize ? viewportSize.width / 20 : 60;
    if (minWidth < 40) minWidth = 60;
    if (minWidth > 100) minWidth = 100;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'end',
                minWidth: width ? (minWidth < width ? minWidth : width) : minWidth,
            }}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                <Text style={{marginLeft: 4}} variant="subheader-1">
                    {placeholder}
                </Text>
                <TextInput
                    hasClear
                    value={filters[name] ? filters[name].val : ''}
                    onChange={(val) => {
                        setFilters(() => {
                            if (!(name in filters))
                                filters[name] = {
                                    compMode: valueType != 'text' ? 'bigger' : 'include',
                                    val: '',
                                };
                            filters[name].val = val.target.value;
                            filterData(filters);
                            return filters;
                        });
                    }}
                    // placeholder={'Фильтр'}
                    rightContent={
                        <DropdownMenu
                            renderSwitcher={(props) => (
                                <Button
                                    {...props}
                                    view={
                                        filters[name]
                                            ? filters[name].val != ''
                                                ? !filters[name].compMode.includes('not')
                                                    ? 'flat-success'
                                                    : 'flat-danger'
                                                : 'flat'
                                            : 'flat'
                                    }
                                    size="xs"
                                >
                                    <Icon data={Funnel} />
                                </Button>
                            )}
                            items={[
                                [
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'include'
                                                            ? CirclePlusFill
                                                            : CirclePlus
                                                        : CirclePlusFill
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'include',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'include';
                                                filterData(filters);
                                                return filters;
                                            });
                                        },
                                        text: 'Включает',
                                    },
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'not include'
                                                            ? CircleMinusFill
                                                            : CircleMinus
                                                        : CircleMinus
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'not include',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'not include';
                                                filterData(filters);
                                                return filters;
                                            });
                                        },
                                        text: 'Не включает',
                                        theme: 'danger',
                                    },
                                ],
                                [
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'equal'
                                                            ? CirclePlusFill
                                                            : CirclePlus
                                                        : CirclePlus
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'equal',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'equal';
                                                filterData(filters);
                                                return filters;
                                            });
                                        },
                                        text: 'Равно',
                                    },
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'not equal'
                                                            ? CircleMinusFill
                                                            : CircleMinus
                                                        : CircleMinus
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'not equal',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'not equal';
                                                filterData(filters);
                                                return filters;
                                            });
                                        },
                                        text: 'Не равно',
                                        theme: 'danger',
                                    },
                                ],
                                valueType != 'text'
                                    ? [
                                          {
                                              iconStart: (
                                                  <Icon
                                                      data={
                                                          filters[name]
                                                              ? filters[name].compMode == 'bigger'
                                                                  ? CirclePlusFill
                                                                  : CirclePlus
                                                              : CirclePlus
                                                      }
                                                  />
                                              ),
                                              action: () => {
                                                  setFilters(() => {
                                                      if (!(name in filters))
                                                          filters[name] = {
                                                              compMode: 'bigger',
                                                              val: '',
                                                          };
                                                      filters[name].compMode = 'bigger';
                                                      filterData(filters);
                                                      return filters;
                                                  });
                                              },
                                              text: 'Больше',
                                          },
                                          {
                                              iconStart: (
                                                  <Icon
                                                      data={
                                                          filters[name]
                                                              ? filters[name].compMode ==
                                                                'not bigger'
                                                                  ? CircleMinusFill
                                                                  : CircleMinus
                                                              : CircleMinus
                                                      }
                                                  />
                                              ),
                                              action: () => {
                                                  setFilters(() => {
                                                      if (!(name in filters))
                                                          filters[name] = {
                                                              compMode: 'not bigger',
                                                              val: '',
                                                          };
                                                      filters[name].compMode = 'not bigger';
                                                      filterData(filters);
                                                      return filters;
                                                  });
                                              },
                                              text: 'Меньше',
                                              theme: 'danger',
                                          },
                                      ]
                                    : [],
                            ]}
                        />
                    }
                />
            </div>
            {additionalNodes ?? <></>}
        </div>
    );
};

export const compare = (a, filterData) => {
    const {val, compMode} = filterData;
    if (compMode == 'include') {
        return String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
    }
    if (compMode == 'not include') {
        return !String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
    }
    if (compMode == 'equal') {
        return String(a).toLocaleLowerCase() == String(val).toLocaleLowerCase();
    }
    if (compMode == 'not equal') {
        return String(a).toLocaleLowerCase() != String(val).toLocaleLowerCase();
    }
    if (compMode == 'bigger') {
        return Number(a) > Number(val);
    }
    if (compMode == 'not bigger') {
        return Number(a) < Number(val);
    }
    return false;
};
