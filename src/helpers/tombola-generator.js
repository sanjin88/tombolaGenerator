export default class BlicdrukTombola {

    constructor(props) {
        this.series = {};
    }

    generateCustomNumberOfUniqueBlocks(number) {
        return new Promise((resolve, reject) => {
            let counter = 1;
            let blocks = [];
            while (counter <= number) {
                let block = this.generateBlockOfSeries();
                blocks.push(block);
                this.savetoSeries(block);
                counter++;
            }

            resolve(blocks);

        });
    }
    generateBlockOfSeries() {
        var candidates = this.generateArrayCandidates();
        var blockCandidate = [];

        while (candidates.length > 0) {
            var candidateSerie = this.generateSerieFromCandidates(candidates);
            candidates = this.removeSelectedCandidates(candidates, candidateSerie);
            blockCandidate.push(candidateSerie);
        }

        // check if all series are unique and correct
        if (blockCandidate.length === 6 && this.hasUniqueSeries(blockCandidate)) {
            return blockCandidate;
        } else {
            false;
            return this.generateBlockOfSeries();
        }
    }

    savetoSeries(block) {
        block.map((serie) => { return this.flattenArray(serie) }).forEach((serie) => {
            this.series[JSON.stringify(serie.sort((a, b) => {
                return a - b;
            }))] = true;
        })
    }

    hasUniqueSeries(block) {
        var hasUniqueSeries = true;
        block.forEach((serie) => {
            if (this.containsArray(this.series, this.flattenArray(serie).sort((a, b) => {
                return a - b;
            }))) {
                hasUniqueSeries = false;
            }
        })
        return hasUniqueSeries;
    }

    removeSelectedCandidates(candidates, serie) {
        var serieFlatten = this.flattenArray(serie)
        return this.arr_diff(candidates, serieFlatten);
    }

    generateSerieFromCandidates(candidates) {
        var serie = [[], [], []];
        var candidatesShuffled = this.shuffleArray(candidates);
        var counts = this.generateEmptyCounts();

        for (var i = 0; i < candidatesShuffled.length; i++) {
            var rangeDigit = Math.floor(candidatesShuffled[i] / 10);
            if (rangeDigit === 9) { // 80-90 belongs to same range
                rangeDigit = 8;
            }
            if (counts[rangeDigit].length < 3) {
                if (serie[0].length < 5 && counts[rangeDigit].indexOf(0) === -1) {
                    serie[0].push(candidatesShuffled[i]);
                    counts[rangeDigit].push(0);
                } else if (serie[1].length < 5 && counts[rangeDigit].indexOf(1) === -1) {
                    serie[1].push(candidatesShuffled[i]);
                    counts[rangeDigit].push(1);
                } else if (serie[2].length < 5 && counts[rangeDigit].indexOf(2) === -1) {
                    serie[2].push(candidatesShuffled[i]);
                    counts[rangeDigit].push(2);
                }
            }
        }

        serie.forEach((row) => {
            row.sort((a, b) => {
                return a - b;
            });
        })

        return serie;
    }

    generateArrayCandidates() {
        var array = [];
        for (var i = 1; i <= 90; i++) {
            array.push(i);
        }
        return array;
    }

    generateEmptyCounts() {
        var counts = {};
        for (var i = 0; i <= 8; i++) {
            counts[i] = [];
        }
        return counts;
    }


    // Array helpers

    shuffleArray(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    arr_diff(a1, a2) {
        var a = [], diff = [];
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
        for (var k in a) {
            diff.push(parseInt(k));
        }
        return diff;
    }

    flattenArray(array) {
        return array.reduce((acc, val) => acc.concat(val), []);
    }

    containsArray(parent, childSerie) {
        return parent[JSON.stringify(childSerie)] === true;
    }


}



