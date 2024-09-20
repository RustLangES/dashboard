import { DatabaseSync } from 'node:sqlite';

const defaultDB =
	'.wrangler/state/v3/d1/56d060060cda9b9bbea5ad9ecf937a6610673e7d83efb6a4863cae9a061cc103.sqlite';
export const database = new DatabaseSync(process.argv[2] ?? defaultDB);
