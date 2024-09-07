export interface Form {
	id: number;
	title: string;
	description: string;
	edition: string;

	/** 0 = false, 1 = true. D1 Things */
	multiple_times: number;
	/** 0 = false, 1 = true. D1 Things */
	deleted: number;

	/** Created datetime in seconds */
	created_at: number;
}
