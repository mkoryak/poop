// a report is the basic building block for parsing the generator of names
// `makeGenerator` method consumes the generator and when it is exhausted, prints the 'report'
class Report {
    update(name) {
        throw new Error("not implemented");
    }

    print() {
        throw new Error("not implemented");
    }

    makeGenerator() {
        const that = this;
        return function* reportGenerator(gen) {
            try {
                while (true) {
                    const name = yield;
                    that.update(name);
                    gen && gen.next(name);
                }
            } finally {
                that.print();
                gen && gen.return();
            }
        };
    }

    printIter(iter) {
        for (let v of iter) {
            console.log(v);
        }
    }
}

// originally when I started writing this, I thought that I could make the uniques / modified uniques be their own
// reports, but that would have required re-processing and storing the same data again. I opted for put those reports
// into here. I could have modified the yeilded value from the generators to include the data it computed, but that
// would require buffering, which I wanted to avoid
class UniqueNamesReport extends Report {
    constructor(maxSpecialUniques) {
        super();
        this.fullNames = new Set();
        this.firstNames = new Set();
        this.lastNames = new Set();
        this.max = maxSpecialUniques;

        this.uniques = { first: [], last: [], full: [] };
        this.modifiedUniques = [];
    }

    update(name) {
        if (
            !this.firstNames.has(name.first) &&
            !this.lastNames.has(name.last) &&
            this.uniques.full.length < this.max
        ) {
            this.uniques.full.push(name.fullName);

            // these 2 are going to be used to generate modified uniques
            this.uniques.first.push(name.first);
            this.uniques.last.push(name.last);
        }
        if (
            this.uniques.full.length === this.max &&
            this.modifiedUniques.length < this.max
        ) {
            // peek and pop
            if (
                this.uniques.first[0] === name.first &&
                this.uniques.last[0] !== name.last
            ) {
                this.modifiedUniques.push(name.fullName);
                this.uniques.first.shift();
                this.uniques.last.shift();
            }
            if (
                this.uniques.first[0] !== name.first &&
                this.uniques.last[0] === name.last
            ) {
                this.modifiedUniques.push(name.fullName);
                this.uniques.first.shift();
                this.uniques.last.shift();
            }
        }
        this.fullNames.add(name.fullName);
        this.firstNames.add(name.first);
        this.lastNames.add(name.last);
    }

    printUniqueAndModifiedNames() {
        this.uniques.full.sort();
        this.modifiedUniques.sort();
        console.log(`Unique names (${this.max}):`.underline.red);
        this.printIter(this.uniques.full);
        console.log("");
        console.log(`Modified unique names (${this.max}):`.underline.red);
        this.printIter(this.modifiedUniques);
        console.log("");
    }

    print() {
        const p = (desc, obj) => {
            console.log(`Unique ${desc}`.underline.red + ": " + obj.size);
        };

        p("first names", this.firstNames);
        p("last names", this.lastNames);
        p("full names", this.fullNames);

        console.log("");

        this.printUniqueAndModifiedNames();
    }
}

class CommonNamesReport extends Report {
    constructor() {
        super();
        this.firstNames = {};
        this.lastNames = {};
    }

    update(name) {
        if (!this.firstNames[name.first]) {
            this.firstNames[name.first] = 0;
        }
        this.firstNames[name.first]++;

        if (!this.lastNames[name.last]) {
            this.lastNames[name.last] = 0;
        }
        this.lastNames[name.last]++;
    }

    print() {
        const p = (desc, obj) => {
            let pairs = Object.entries(obj);
            pairs.sort((a, b) => b[1] - a[1]);
            const names = pairs
                .filter((v, i) => i < 10)
                .map(p => `${p[0]} -> ${p[1]}`);
            console.log(desc.underline.red + ":");
            this.printIter(names);
            console.log("");
        };
        p("Ten most common last names", this.lastNames);
        p("Ten most common first names", this.firstNames);
    }
}

module.exports = {
    CommonNamesReport,
    UniqueNamesReport
};
