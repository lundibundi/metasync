'use strict';

// id :: a -> a
function id(x) {
  return x;
}

// curry :: ((a, b) -> c) -> a -> b -> c
function curry(f, ...args1) {
  return (...args2) => f(...args1, ...args2);
}

function withCb(func) {
  return (...argsCb) => {
    const callback = argsCb[argsCb.length - 1];
    const args = argsCb.slice(0, argsCb.length - 1);
    return func(args, callback);
  };
}

// fmap :: Functor f => (a -> b) -> f a -> f b
function fmap(f, asyncF) {
  const asyncF2 = withCb((args, callback) => of(f(...args))(callback));
  return chain(asyncF, asyncF2);
}

// pure :: Applicative f => f (a -> b) -> f a -> f b
function of(...args) {
  return callback => callback(null, ...args);
}

// <*> :: Applicative f => f (a -> b) -> f a -> f b
function ap(funcA, asyncF) {
  return chain(funcA, (f, callback) => fmap(f, asyncF)(callback));
}

// (>>=) :: Monad m => m a -> (a -> m b) -> m b
function chain(asyncF, funcM) {
  return withCb((args1, callback) =>
    asyncF(...args1, (err, ...args2) => {
      if (err !== null) {
        callback(err);
      } else {
        funcM(...args2, callback);
      }
    })
  );
}

//function execAfterSec(f) {
  //return curry(setTimeout, f, 1000);
//}

const fs = require('fs');

function readFrom(filename) {
  return curry(fs.readFile, filename);
}
function writeTo(filename) {
  return curry(fs.writeFile, filename);
}

chain(readFrom('monads.js'), writeTo('monads.cpy.js'))(id);

chain(of('One two three four\n'), writeTo('oneTwoThree.txt'))(id);

const split = str => str.toString().split(' ');
fmap(split, readFrom('oneTwoThree.txt'))(console.log);

module.exports = (api) => {
  api.metasync.monad = { fmap, ap, of, chain, withCb };
};
