import {Button, DropdownMenu, Icon, Text} from '@gravity-ui/uikit';
import {DelayedTextInput} from '@gravity-ui/components';
import {CircleMinus, CircleMinusFill, CirclePlus, CirclePlusFill, Funnel} from '@gravity-ui/icons';

interface GenerateFilterTextInputParams {
    filters: any;
    setFilters: any;
    filterData: any;
    name: any;
    placeholder: any;
    valueType: any;
    constWidth: any;
    width: any;
    viewportSize: any;
    additionalNodes: any;
}

export const generateFilterTextInput = (args: GenerateFilterTextInputParams) => {
    const {
        filters,
        setFilters,
        filterData,
        name,
        placeholder,
        valueType,
        constWidth,
        width,
        viewportSize,
        additionalNodes,
    } = args;
    let minWidth = viewportSize ? viewportSize.width / 20 : 60;
    if (minWidth < 40) minWidth = 60;
    if (minWidth > 250) minWidth = 200;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: 'max-content',
                alignItems: 'end',
                minWidth: (constWidth ?? width) ? (minWidth < width ? minWidth : width) : minWidth,
                maxWidth: constWidth,
                width: constWidth,
            }}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'end',
                }}
            >
                <Text style={{marginLeft: 4}} variant="subheader-1">
                    {placeholder}
                </Text>
                <DelayedTextInput
                    style={{width: '100%'}}
                    delay={250}
                    hasClear
                    value={filters[name] ? filters[name].val : ''}
                    onUpdate={(val) => {
                        setFilters(() => {
                            if (!(name in filters))
                                filters[name] = {
                                    compMode: valueType != 'text' ? 'bigger' : 'include',
                                    val: '',
                                };
                            filters[name].val = val;
                            filterData(filters);
                            return {...filters};
                        });
                    }}
                    endContent={
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
                                                return {...filters};
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
                                                return {...filters};
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
                                                return {...filters};
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
                                                return {...filters};
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
                                                      return {...filters};
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
                                                      return {...filters};
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
