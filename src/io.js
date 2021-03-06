'use strict';

const daggy = require('daggy');
const {constant} = require('fantasy-combinators');
const {of, chain, map, ap} = require('fantasy-land');

const IO = daggy.tagged('unsafePerform');

// Methods
IO[of] = (x) => IO(constant(x));

IO.prototype[chain] = function(g) {
    return IO(async env => g(await this.unsafePerform(env)).unsafePerform(env));
};

// Derived
IO.prototype[map] = function(f) {
    return this[chain]((a) => IO[of](f(a)));
};

IO.prototype[ap] = function(a) {
    return this[chain]((f) => a[map](f));
};

IO.of = IO[of];
IO.prototype.chain = IO.prototype[chain];
IO.prototype.map = IO.prototype[map];
IO.prototype.ap = IO.prototype[ap];

module.exports = IO;
