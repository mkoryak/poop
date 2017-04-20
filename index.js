const fs = require("fs");
const path = require("path");
const readline = require("readline");
const colors = require("colors");
const { CommonNamesReport, UniqueNamesReport } = require("./reports");

const UNIQUE_NAMES = Symbol();

////////// Base classes ///////////////

class Name {
    constructor({ first, last }) {
        this.first = first;
        this.last = last;
    }

    static create({ first, last }) {
        // i do this so that i can add a Name to a set and it work as expected, since set tests
        // membership with ===
        const name = new Name({ first, last });
        if (!Name[UNIQUE_NAMES][name.fullName]) {
            Name[UNIQUE_NAMES][name.fullName] = name;
        }
        return Name[UNIQUE_NAMES][name.fullName];
    }

    get fullName() {
        return this.first + " " + this.last;
    }
}
Name[UNIQUE_NAMES] = {};

///////// generator utils //////////////

const chain = (...gens) => {
    let generatorObject = gens.pop()();
    generatorObject.next();
    for (let i = gens.length - 1; i >= 0; i--) {
        let genFn = gens[i];
        generatorObject = genFn(generatorObject);
        generatorObject.next();
    }
    return generatorObject;
};

const nameReader = function*(gen) {
    try {
        while (true) {
            const line = yield;
            const match = line.match(/^([a-zA-Z]+), ([a-zA-Z]+)\b/);
            if (match && match.length === 3) {
                gen.next(Name.create({ first: match[2], last: match[1] }));
            }
        }
    } finally {
        gen.return();
    }
};

const readLines = gen => {
    const rd = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, "data.txt")),
        output: process.stdout,
        terminal: false
    });

    rd
        .on("line", line => {
            gen.next(line);
        })
        .on("close", () => {
            gen.return();
        });
};

/////////////// run the thing!

// build the chain of generators that the names will stream though
const uniqueNamesReport = new UniqueNamesReport(25);
const commonNamesReport = new CommonNamesReport();

if (!module.parent) {
    // run this thing if this is the entry point
    readLines(
        chain(
            nameReader,
            uniqueNamesReport.makeGenerator(),
            commonNamesReport.makeGenerator()
        )
    );
}

module.exports = {
    Name,
    nameReader
};
