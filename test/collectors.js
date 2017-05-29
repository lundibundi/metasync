'use strict';

const tap = require('tap');
const metasync = require('..');

tap.test('data collector', (test) => {
  const expectedResult = {
    key1: 1,
    key2: 2,
    key3: 3,
  };

  const dc = metasync
    .collect(3)
    .done((err, result) => {
      test.error(err);
      test.strictSame(result, expectedResult);
      test.end();
    });

  dc('key1', 1);
  dc('key2', 2);
  dc('key3', 3);
});

tap.test('data collector', (test) => {
  const expectedResult = {
    key1: 1,
    key2: 2,
    key3: 3,
  };

  const kc = metasync
    .collect(['key1', 'key2', 'key3'])
    .done((err, result) => {
      test.error(err);
      test.strictSame(result, expectedResult);
      test.end();
    });

  kc('key1', 1);
  kc('key2', 2);
  kc('key3', 3);
});

tap.test('distinct data collector', (test) => {
  const expectedResult = {
    key1: 2,
    key2: 2,
    key3: 3,
  };

  const dc = metasync
    .collect(3)
    .distinct()
    .done((err, result) => {
      test.error(err);
      test.strictSame(result, expectedResult);
      test.end();
    });

  dc('key1', 1);
  dc('key1', 2);
  dc('key2', 2);
  dc('key3', 3);
});

tap.test('distinct key collector', (test) => {
  const expectedResult = {
    key1: 2,
    key2: 2,
    key3: 3,
  };

  const kc = metasync
    .collect(['key1', 'key2', 'key3'])
    .distinct()
    .done((err, result) => {
      test.error(err);
      test.strictSame(result, expectedResult);
      test.end();
    });

  kc('key1', 1);
  kc('key1', 2);
  kc('key2', 2);
  kc('key3', 3);
});

tap.test('data collector with repeated keys', (test) => {
  const expectedResult = {
    key1: 2,
    key2: 2,
  };

  const dc = metasync
    .collect(3)
    .done((err, result) => {
      test.error(err);
      test.strictSame(result, expectedResult);
      test.end();
    });

  dc('key1', 1);
  dc('key1', 2);
  dc('key2', 2);
});

tap.test('key collector with repeated keys', (test) => {
  const expectedResult = {
    key1: 2,
    key2: 2,
  };

  const kc = metasync
    .collect(['key1', 'key2', 'key3'])
    .done((err, result) => {
      test.error(err);
      test.strictSame(result, expectedResult);
      test.end();
    });


  kc('key1', 1);
  kc('key1', 2);
  kc('key2', 2);
});
