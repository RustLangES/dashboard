import { database } from './db.js';
import { addIdentation, ARROW, BOLD, DIM, ERROR, getIdentation, L_PURPLE, L_RED, RESET, subIdentation, UP_ARROW } from './util.js';

const DATA = {};

/**
 * @param {number} count
 * @param {string} table
 * @param {{ [k: string]: (data: object, index: number) => string | number }} fields
 * @param {null | (data: object, index: number) => void} extra
 */
export function seedTable(count, table, fields, extra) {
	DATA[table] = [];
	const d = [];

	console.log(`${getIdentation()}${L_PURPLE}${ARROW} Creating ${count} rows in ${table}${RESET}`);
  addIdentation();
	const keys = Object.keys(fields);

	const tableKeys = keys.join(', ');
	const tableValues = new Array(keys.length).fill('?').join(', ');
	const sql = `INSERT INTO ${table} (${tableKeys}) VALUES (${tableValues})`;
	console.log(`${getIdentation()}${DIM}${ARROW} Using: ${BOLD}${sql}${RESET}`);
	const query = database.prepare(sql);

	for (let idx = 0; idx < count; idx++) {
		const values = [];
		const data = {};

		for (const key of keys) {
			const val = fields[key](data, idx);

			if (typeof val === 'boolean') {
				console.warn(`
${L_RED}${ERROR} Boolean values are not supported by SQLITE. Try using numbers instead (${
					val ? 1 : 0
				}).
╰┬ Table: ${table}
 ├ Field: ${key}
 ├ Value: ${val}
${RESET}`);
				process.exit(2);
			} else if (val !== null && typeof val !== 'string' && typeof val !== 'number') {
				console.warn(`
${L_RED}${ERROR} ${typeof val} values are not supported by SQLITE.
╰┬ Table: ${table}
 ├ Field: ${key}
 ├ Value: ${val}
${RESET}`);
				process.exit(2);
			}

			values.push(val);
			data[key] = val;
		}

		const logValues = values.map((val) => {
			val = `${val}`;
			const v = val.slice(0, 10);

			if (v.length === val.length) {
				return v;
			} else {
				return v + '..';
			}
		});

		console.log(`${getIdentation()}${DIM}${UP_ARROW} Executing with ${BOLD}(${logValues.join(', ')})${RESET}`);

		try {
			query.run(...values);
			DATA[table].push(data);
			d.push(data);

			if (extra) {
				extra(data, idx);
			}
		} catch (e) {
			const error = `${e}`;
			const getBacktrace = () =>
				e.stack
					.split('\n')
					.slice(2, -3)
					.join('\n')
					.replaceAll('file://', '')
					.replaceAll(process.cwd(), '.');
			if (error.includes('NOT NULL')) {
				const field = error.split('.')[1];

				console.error(`\n${L_RED}${ERROR} ${table} require field "${field}"`);
				console.error(getBacktrace());
				process.exit(3);
			}

			console.error(e);
			process.exit(3);
		}
	}

  subIdentation();

	console.log(`${getIdentation()}${L_PURPLE}${ARROW} Created ${count} rows in ${table}${RESET}`);

	return d;
}

export function getRows(table) {
	const data = DATA[table];

	if (!data) {
		console.error(`Use the seeder first for ${table}`);
		process.exit(1);
	}

	return data;
}
