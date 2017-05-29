'use strict';

const tap = require('tap');
const metasync = require('..');

tap.test('queue', (test) => {
  const queue =  new metasync.ConcurrentQueue(3, 2000);
  let taskIndex = 1;

  queue.on('process', (item, callback) => {
    process.nextTick(() => {
      test.strictSame(item, { id: taskIndex });
      taskIndex++;
      callback(null);
    });
  });

  queue.on('empty', () => {
    test.end();
  });

  let id;
  for (id = 1; id < 10; id++) {
    queue.add({ id });
  }
});


tap.test('queue', (test) => {
  const queue =  new metasync.ConcurrentQueue(3, 2000);
  queue.pause();
  test.strictSame(queue.events.empty, null);

  queue.resume();
  test.strictSame(queue.events.empty !== null, true);

  queue.stop();
  test.strictSame(queue.count, 0);
  test.end();
});
