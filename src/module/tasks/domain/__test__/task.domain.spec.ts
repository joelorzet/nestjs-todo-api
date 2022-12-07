import { Task } from '../task.domain';

describe('Task', () => {
  let task: Task;

  beforeEach(() => {
    task = new Task();
  });

  it('a domain should be empty at first', () => {
    expect(task.title).toStrictEqual(undefined);
  });
});
