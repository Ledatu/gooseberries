interface Rules {
	key: string;
	biggerOrEqual: boolean;
	val: number;
	viewsThreshold: number;
}

// id: serial().primaryKey(),
//     name: varchar({ length: 255 }).notNull(),
//     isFixed: boolean().default(false),
//     seller_id: varchar({ length: 255 }).notNull(),
//     phrasesSelectedByPlus: text().array().default(sql.raw(`ARRAY[]::text[]`)),
//     phrasesExcludedByMinus: text().array().default(sql.raw(`ARRAY[]::text[]`)),
//     includes: text()
//       .array()
//       .default(sql.raw(`ARRAY[]::text[]`)),
//     notIncludes: text()
//       .array()
//       .default(sql.raw(`ARRAY[]::text[]`)),
//     viewsThreshold: integer(),
//     selectedByAutoPhrases: text()
//       .array()
//       .default(sql.raw(`ARRAY[]::text[]`)),
//     rules: jsonb().$type<AdvertRules>().array().default([])

interface AutoPhrasesTemplateDto {
	// id: number,

	name: string,
	isFixed: boolean,
	seller_id: string,
	phrasesSelectedByPlus: string[],
	phrasesExcludedByMinus: string[],
	fixedClusters: string[],
	viewsThreshold: number,
	selectedByAutoPhrases: string[],
	includes: string[],
	notIncludes: string[],
	rules: Rules[],
	excludedNum: number,
	clustersNum: number,
}
