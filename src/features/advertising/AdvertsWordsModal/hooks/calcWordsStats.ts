import { ClusterData } from "../api";
import { PhrasesStats } from "../types/PhraseStats";

export const calcWordsStats = (clusterData: ClusterData[], excludedClustersData: ClusterData[]): PhrasesStats[] => {
	const wordsData: Map<
		string,
		PhrasesStats
	> = new Map();
	const clusters: ClusterData[] = clusterData.concat(excludedClustersData);
	for (const data of clusters) {
		console.log(data)
		const words: string[] = data.cluster.replace(/[.,!]/g, "").split(" ");
		for (const word of words) {
			if (!wordsData.has(word)) {
				wordsData.set(word, { views: data.views, frequency: data.totalFrequency, keyword: word });
			} else {
				const info: PhrasesStats = wordsData.get(word)!;
				wordsData.set(word, {
					keyword: word,
					views: info.views + data.views,
					frequency: info.frequency + data.totalFrequency
				});
			}
		}
	}

	const res = Array.from(wordsData.values())
		.filter((data) => data.keyword && data.keyword !== "")
		.sort((a, b) => b.frequency - a.frequency);
	console.log(res);
	return res;
}