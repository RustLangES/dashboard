export interface Form {
	id: number;
	title: string;
	description: string;
	edition: string;

	/** 0 = false, 1 = true. D1 Things */
	multiple_times: number;

	/** 0 = false, 1 = true. D1 Things */
	require_login: number;

	/** 0 = false, 1 = true. D1 Things */
	deleted: number;

	/** Created datetime in seconds */
	created_at: number;
}

type Step<Type extends string, Data extends object> = {
	id: number;
	title: string;
	description: string;
	type: Type;
	data: Data;
};

export type Question = QuestionText | QuestionQuestionText | QuestionOptions;

export type QuestionText = Step<'text', {}>;

export type QuestionQuestionText = Step<'questionText', { required?: boolean }>;

export type QuestionOptions = Step<
	'options',
	{
		canMultiple: boolean;
		required: boolean;
		options: Array<string>;
	}
>;
