import { DatabaseSync } from 'node:sqlite';
import { faker } from '@faker-js/faker';
const database = new DatabaseSync(
  '.wrangler/state/v3/d1/56d060060cda9b9bbea5ad9ecf937a6610673e7d83efb6a4863cae9a061cc103.sqlite'
);

function cleanDB() {
  const delete_form = database.prepare('DELETE FROM Form');
  const delete_question = database.prepare('DELETE FROM Question');
  const delete_answer = database.prepare('DELETE FROM Answer');
  const delete_session = database.prepare('DELETE FROM Session');
  const delete_external = database.prepare('DELETE FROM External');
  delete_form.all();
  delete_question.all();
  delete_answer.all();
  delete_session.all();
  delete_external.all();
  console.log('Tablas Form, Question, Answer, Session, External han sido limpiadas.');
}

cleanDB();

function seedForm(n) {
  const q = database.prepare('INSERT INTO Form (external_id, token, kind, email, created_at, deleted) VALUES (?, ?, ?, ?, ?, ?)');
  for (let i = 0; i < n; i++) {
    const random_external_id = faker.string.uuid();
    const random_token = faker.string.uuid();
    const random_kind = 'Github';
    const random_email = faker.internet.email();
    const random_created_at = Math.floor(Date.now() / 1000);
    const deleted = 0;
    q.run(random_external_id, random_token, random_kind, random_email, random_created_at, deleted);
  }
  console.log(`${n} registros insertados en la tabla External.`);

}

function seedQuestion() { }

function seedAnswer() { }

function seedSession() { }

function seedExternal(n) {
  const q = database.prepare('INSERT INTO External (external_id, token, kind, email, created_at, deleted) VALUES (?, ?, ?, ?, ?, ?)');
  for (let i = 0; i < n; i++) {
    const random_external_id = faker.string.uuid();
    const random_token = faker.string.uuid();
    const random_kind = 'Github';
    const random_email = faker.internet.email();
    const random_created_at = Math.floor(Date.now() / 1000);
    const deleted = 0;
    q.run(random_external_id, random_token, random_kind, random_email, random_created_at, deleted);
  }
  console.log(`${n} registros insertados en la tabla External.`);
}

seedExternal(5);

database.close();
