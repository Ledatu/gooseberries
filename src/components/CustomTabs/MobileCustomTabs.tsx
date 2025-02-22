'use client';

import {useModules} from '@/contexts/ModuleProvider';
import {Icon, Link, Tab, TabProvider, Text} from '@gravity-ui/uikit';
import {useState, useEffect, useMemo} from 'react';
import {useSearchParams} from 'next/navigation';

import {ChartColumnStacked, CircleQuestion, GraduationCap, Key} from '@gravity-ui/icons';
export const MobileTabs = () => {
    const {setModule, currentModule, availableModules} = useModules();
		const searchParams = useSearchParams();
	

    const optionsPages: any[] = useMemo(
        () =>
            [
                {
                    icon: ChartColumnStacked,
                    id: 'massAdvert',
                    title: 'Реклама',
					href: `/${'massAdvert'}?${searchParams.toString()}`,
                    // disabled: !modules.includes('all') && !modules.includes('massAdvert'),
                },
                {
                    icon: Key,
                    id: 'api',
                    title: 'Магазины',
					href: `/${'api'}?${searchParams.toString()}`,

                },
                {
                    icon: CircleQuestion,
                    title: 'Поддержка',
                    href: 'https://t.me/AurumSkyNetSupportBot',
                    target: '_blank',
                },
                {
                    icon: GraduationCap,
                    title: 'База знаний',
                    href: 'https://aurum-wiki.tilda.ws/tdocs/',
                    target: '_blank',
                },
            ].filter((page) => page.id === undefined || availableModules.includes(page.id as any)),
        [availableModules],
    );
    const [_valueOfTab, setValueOfTab] = useState<string | null>(null);
    useEffect(() => {
        if (currentModule) {
            setValueOfTab(currentModule);
        }
    }, [currentModule]);
    return (
        <TabProvider
            onUpdate={(value: string) => {
                setValueOfTab(value);
            }}
        >
            {optionsPages?.map((item, index) => {
                if (item === undefined || index === undefined) return <></>;
                const isCurrent =
                    (currentModule == 'noModules' && item.id == 'api') ||
                    item.id == (currentModule as string);
					if (!item.id)
				{
				return <Link
                href={item?.href}
                className="tablink"
                style={{color: 'var(--g-color-text-primary)', textDecoration: 'none'}}
            >
                <Text
                    variant="caption-2"
                    color={isCurrent ? 'brand' : 'primary'}
                    style={{
                        height: 70,
                        paddingBottom: 10,
                        width: 70,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon data={item?.icon} size={24} />
                    {item.title}
                </Text>
            </Link>
						}
                return (
                    <Tab value={item.id as string} key={index} title={item.title}>
                        <div>
                            <Text
                                variant="caption-2"
                                className="tablink"
                                color={isCurrent ? 'brand' : 'primary'}
                                onClick={() => {
                                    if (item.disabled || !item.id) return;
                                    setModule(item.id);
                                }}
                                style={{
                                    height: 70,
                                    paddingBottom: 10,
                                    width: 70,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon data={item?.icon} size={24} />
                                {item.title}
                            </Text>
                        </div>
                    </Tab>
                );
            })}
        </TabProvider>
    );
};
