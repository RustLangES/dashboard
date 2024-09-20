import { faker } from '@faker-js/faker';
import { database } from './db.js';

export const RESET = '\x1b[0m';
export const BOLD = '\x1b[1m';
export const DIM = '\x1b[2m';

export const L_RED = '\x1b[1;91m';
export const L_PURPLE = '\x1b[1;95m';

export const ARROW = '▶';
export const ERROR = '⨯';
export const UP_ARROW = '↑';

export const getCreatedAt = () => Math.floor(+faker.date.past() / 1000);

export function runSql(sql, ...args) {
	console.log(`${DIM}${UP_ARROW} Executing: ${BOLD}${sql}${RESET}`);
	return database.prepare(sql).all(...args);
}
