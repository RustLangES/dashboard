import { DatabaseSync } from 'node:sqlite';
import { BOLD, DIM, getIdentation, RESET, UP_ARROW } from './util.js';

const defaultDB =
	'.wrangler/state/v3/d1/miniflare-D1DatabaseObject/56d060060cda9b9bbea5ad9ecf937a6610673e7d83efb6a4863cae9a061cc103.sqlite';
export const database = new DatabaseSync(process.argv[2] ?? defaultDB);

export function runSql(sql, ...args) {
	console.log(`${getIdentation()}${DIM}${UP_ARROW} Executing: ${BOLD}${sql}${RESET}`);
	return database.prepare(sql).all(...args);
}
