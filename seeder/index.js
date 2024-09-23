import { faker } from '@faker-js/faker';
import { addIdentation, ARROW, DIM, getCreatedAt, L_PURPLE, RESET, subIdentation } from './util.js';
import { getRows, seedTable } from './seeder.js';
import { database, runSql } from './db.js';

const CONFIG = {
	forms: 5,
	userAccounts: 10,
	questionsPerForm: 5,
	anwersPerForm: 5
};

function deleteTable(table) {
	try {
		runSql(`DELETE FROM ${table}`);
	} catch {
		console.log(`${DIM} Table ${table} doesn't exist.`);
		console.error(`Ask to get a copy of the test database, this should be fixed soon`);
		process.exit(1);
	}
}

function cleanDB() {
	console.log(`${L_PURPLE}${ARROW} Clearing DB${RESET}`);
  addIdentation();

	deleteTable('Form');
	deleteTable('Question');
	deleteTable('Answer');
	deleteTable('Session');
	deleteTable('External');

  subIdentation();
	console.log(`${L_PURPLE}${ARROW} Cleared${RESET}`);
}

cleanDB();

seedTable(CONFIG.userAccounts, 'External', {
	external_id: () => faker.string.uuid(),
	token: () => faker.string.uuid(),
	kind: () => 'Github',
	email: () => faker.internet.email(),

	created_at: getCreatedAt,
	deleted: () => 0
});

seedTable(
	CONFIG.forms,
	'Form',
	{
		title: () => faker.lorem.sentence({ min: 1, max: 5 }),
		description: () => faker.helpers.arrayElement([faker.lorem.paragraph(), '']),
		edition: () => faker.lorem.sentence({ min: 0, max: 1 }),
		multiple_times: () => faker.helpers.arrayElement([0, 1]),
		require_login: () => faker.helpers.arrayElement([0, 1]),

		created_at: getCreatedAt,
		deleted: () => 0
	},
	(_, form_id) => {
		const questions = seedTable(CONFIG.questionsPerForm, 'Question', {
			form_id: () => form_id + 1,
			title: () => faker.lorem.sentence({ min: 1, max: 5 }),
			description: () => faker.lorem.paragraph(),
			type: () => faker.helpers.arrayElement(['text', 'questionText', 'questionText', 'options', 'options']),
			data: ({ type }) => {
				if (type === 'text') {
					return '{}';
				} else if (type === 'questionText') {
					return '{}';
				} else if (type === 'options') {
					return JSON.stringify({
						required: faker.datatype.boolean(),
						can_multiple: faker.datatype.boolean(),
						options: new Array(faker.number.int({ min: 2, max: 5 }))
							.fill(0)
							.map(() => faker.lorem.word())
					});
				}
			},

			created_at: getCreatedAt,
			deleted: () => 0
		});

		const form_offset = form_id * CONFIG.anwersPerForm;

		const answer_offset = form_offset * CONFIG.questionsPerForm;

		seedTable(
			CONFIG.anwersPerForm,
			'Session',
			{
				external_id: () => faker.number.int({ min: 1, max: getRows('External').length }),
				form_id: () => form_id + 1,
				token: () => faker.helpers.arrayElement([null, faker.string.uuid()]),
				device_id: () => faker.number.int({ min: 1111111111111, max: 9999999999999 }).toString(),
				last_answer: ({ token }, session_idx) =>
					!token
						? form_offset + (session_idx + 1) * CONFIG.questionsPerForm
						: faker.datatype.boolean()
							? faker.number
									.int({
										min: answer_offset + session_idx * CONFIG.questionsPerForm + 1,
										max: answer_offset + (session_idx + 1) * CONFIG.questionsPerForm
									})
									.toString()
							: '',
				steps: ({ last_answer }, session_idx) => {
					if (last_answer.length === 0) {
						return '';
					} else {
						const min = answer_offset + session_idx * CONFIG.questionsPerForm;
						const range = parseInt(last_answer) - min - 1;

						const past =
							range > 0
								? faker.helpers.arrayElements(
										new Array(range).fill(0).map((_, i) => min + i + 1),
										{ min: 0, max: range }
									)
								: [];

						past.push(parseInt(last_answer));

						past.sort();

						return ':' + past.join(';');
					}
				},

				created_at: getCreatedAt,
				deleted: () => 0
			},
			(_, session_idx) => {
				seedTable(CONFIG.questionsPerForm, 'Answer', {
					// TODO:
					session_id: () => form_offset + session_idx + 1,
					question_id: (_, idx) => form_id * CONFIG.questionsPerForm + idx + 1,
					form_id: () => form_id + 1,
					data: ({ question_id }) => {
						const questions = getRows('Question');
						const question = questions[question_id - 1];

						if (question.type === 'text') {
							return '';
						}

						if (question.type === 'questionText') {
							return faker.lorem.sentence();
						}

						if (question.type === 'options') {
							const data = JSON.parse(question.data);
							const options = data.options;

							return data.can_multiple
								? JSON.stringify(faker.helpers.arrayElements(options))
								: faker.helpers.arrayElement(options);
						}

            throw new Error("Unkown question type")
					},
					created_at: getCreatedAt,
					deleted: () => 0
				});
			}
		);
	}
);

database.close();
