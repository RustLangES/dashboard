import { faker } from '@faker-js/faker';

export const RESET = '\x1b[0m';
export const BOLD = '\x1b[1m';
export const DIM = '\x1b[2m';

export const L_RED = '\x1b[1;91m';
export const L_PURPLE = '\x1b[1;95m';

export const ARROW = '▶';
export const ERROR = '⨯';
export const UP_ARROW = '↑';

let identation = 0;

export const addIdentation = () => identation += 1;
export const subIdentation = () => identation = Math.max(0, identation - 1);
export const getIdentation = () => DIM + "╎ ".repeat(identation) + RESET;

export const getCreatedAt = () => Math.floor(+faker.date.past() / 1000);
