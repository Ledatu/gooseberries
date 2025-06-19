export const getWordsWarningArtIcon = (nmId: number, unvalidatedArts: any[]) => {
	const nmIdArray = unvalidatedArts.map((art) => art.nmId);
	const nmIdIndex = nmIdArray.findIndex((element) => element == nmId);
	if (nmIdIndex != -1) {
		const art = unvalidatedArts[nmIdIndex];
		const keys = Object.keys(art);
		const words: string[] = [];
		for (const key of keys) {
			switch (key) {
				case 'prices':
					words.push('себестоимость');
					break;
				case 'tax':
					words.push('налог');
					break;
				default:
					break;
			}
		}
		return words;
	}
	return [];
}