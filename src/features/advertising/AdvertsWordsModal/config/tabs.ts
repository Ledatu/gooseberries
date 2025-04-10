interface TabProps{
	title : string,
	id: string,
}
export const tabs: TabProps[] = [{ id: 'ActiveClusters', title: 'Активные кластеры' },
{ id: 'InActiveClusters', title: 'Исключённые кластеры' },
{ id: 'AutoPhrases', title: 'Авто фразы' },
// { id: 'FixedPhrases', title: "Фиксированные фразы" },
{ id: 'Settings', title: 'Настройки' },
{ id: 'ChangeTemplate', title: 'Сменить правило' }]