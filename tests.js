const test = require("tape");
const { nameReader, Name } = require("./index");
const { CommonNamesReport, UniqueNamesReport } = require("./reports");

const cnr = new CommonNamesReport();

test("can parse names", function(t) {
    t.plan(5);

    function* next() {
        const good = yield;
        t.equal(good.first, "bart");
        t.equal(good.last, "simpson");
        const maggie = yield;
        t.notEqual(maggie.first, "b0rt", 'we skipped "b0rt simpson"');
        t.notEqual(maggie.first, "b", 'the regex should not allow numbers in names');
        t.equal(
            maggie.fullName,
            "maggie simpson",
            'next correct name is "maggie simpson"'
        );
    }
    const nextgen = next();
    nextgen.next();
    const gen = nameReader(nextgen);

    gen.next();
    gen.next("simpson, bart");
    gen.next("simpson, b0rt");
    gen.next("simpson, maggie");
    gen.return();
});

test("can generate unique names", function(t) {
    t.plan(5);

    const unr = new UniqueNamesReport(2);

    function* next() {
        try {
            while (true)
                yield;
        } finally {
            t.equal(unr.firstNames.size, 3, "there are 3 unique first names");
            t.equal(unr.lastNames.size, 3, "there are 3 unique last names");
            t.equal(unr.fullNames.size, 4, "there are 4 unique full names");
            t.equal(
                unr.uniques.full.length,
                2,
                "there are 2 unique (the 2nd part of the problem) full names"
            );
            t.equal(
                unr.modifiedUniques.length,
                0,
                "there are 0 modified unique names"
            );
        }
    }
    const nextgen = next();
    nextgen.next();
    const gen = unr.makeGenerator()(nextgen);

    gen.next();
    gen.next(new Name({ first: "cat", last: "man" }));
    gen.next(new Name({ first: "cat", last: "man" }));
    gen.next(new Name({ first: "cat", last: "moon" }));
    gen.next(new Name({ first: "dog", last: "man" }));
    gen.next(new Name({ first: "bruce", last: "lee" }));
    gen.return();
});

test("can generate unique names some moar", function(t) {
    t.plan(2);

    const unr = new UniqueNamesReport(1);

    function* next() {
        try {
            while (true)
                yield;
        } finally {
            t.equal(
                unr.uniques.full.length,
                1,
                "there are 2 unique (the 2nd part of the problem) full names"
            );
            t.equal(
                unr.modifiedUniques.length,
                1,
                "there is 1 modified unique name"
            );
        }
    }
    const nextgen = next();
    nextgen.next();
    const gen = unr.makeGenerator()(nextgen);

    gen.next();
    gen.next(new Name({ first: "cat", last: "man" }));
    gen.next(new Name({ first: "cat", last: "man" }));
    gen.next(new Name({ first: "cat", last: "moon" }));
    gen.next(new Name({ first: "dog", last: "man" }));
    gen.next(new Name({ first: "bruce", last: "lee" }));
    gen.next(new Name({ first: "dog", last: "poop" }));
    gen.return();
});

test("can count unique names", function(t) {
    t.plan(3);

    const cnr = new CommonNamesReport();

    function* next() {
        let count = 0;
        try {
            while (++count) {
                yield;
            }
        } finally {
            t.equal(
                cnr.firstNames.cat,
                3,
                'there are 3 creatures with first name "cat"'
            );
            t.equal(
                cnr.lastNames.man,
                3,
                'there are 3 creatures with last name "man"'
            );
            t.equal(count - 1, 5, "we looked at 5 names");
        }
    }
    const nextgen = next();
    nextgen.next();
    const gen = cnr.makeGenerator()(nextgen);

    gen.next();
    gen.next(new Name({ first: "cat", last: "man" }));
    gen.next(new Name({ first: "cat", last: "man" }));
    gen.next(new Name({ first: "cat", last: "moon" }));
    gen.next(new Name({ first: "dog", last: "man" }));
    gen.next(new Name({ first: "bruce", last: "lee" }));
    gen.return();
});
