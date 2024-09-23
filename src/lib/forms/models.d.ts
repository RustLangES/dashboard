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

export interface Session {
	id: number;
	device_id: string;
	form_id: number;
	external_id: number;
	token: string;
	last_answer: number;
	steps: string;

	/** Created datetime in seconds */
	created_at: number;
}

export interface Answer {
	id: number;
	form_id: number;
	question_id: number;
	session_id: number;
	data: string;
}

export interface External {
	id: number;
	external_id: string;
	kind: string;
	email: string;
	token: string;
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
