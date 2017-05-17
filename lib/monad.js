'use strict';

const withCb = (
  // Transforms function with args arguments and callback
  // to function with args as separate values and callback
  func // func(args, callback)
       //   args - arguments array
       //   callback - callback
  // returns function with arguments gathered from
  //   args as separate values and callback
) => (...argsCb) => {
  const callback = argsCb[argsCb.length - 1];
  const args = argsCb.slice(0, argsCb.length - 1);
  return func(args, callback);
};

// pure :: Applicative f => a -> f a
const of = (...args) => callback => callback(null, ...args);

// (>>=) :: Monad m => m a -> (a -> m b) -> m b
const chain = (asyncF, funcM) => withCb((args1, callback) =>
  asyncF(...args1, (err, ...args2) => {
    if (err !== null) {
      callback(err);
    } else {
      funcM(...args2, callback);
    }
  })
);

// fmap :: Functor f => (a -> b) -> f a -> f b
const fmap = (f, asyncF) => {
  const asyncF2 = withCb((args, callback) => of(f(...args))(callback));
  return chain(asyncF, asyncF2);
};

// <*> :: Applicative f => f (a -> b) -> f a -> f b
const ap = (funcA, asyncF) =>
  chain(funcA, (f, callback) => fmap(f, asyncF)(callback));

module.exports = (api) => {
  api.metasync.monad = { fmap, ap, of, chain, withCb };
};
