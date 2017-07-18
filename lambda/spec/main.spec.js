const rewire = require('rewire');
const app = rewire('../src/main.js');

describe('Lamda Function Handler', function() {

    it('should count occurrences and filter', function() {
        let countOccurrences = app.__get__('countOccurrences');

        let input = ["APPLE", "SAMSUNG", "APPLE", "THE"];
        let filter = ["THE"];
        let expected = [["APPLE", 2], ["SAMSUNG", 1]];

        expect(countOccurrences(input, filter)).toEqual(expected);
    });

    it('should count occurrences', function() {
        let countOccurrences = app.__get__('countOccurrences');

        let input = ["APPLE", "SAMSUNG", "APPLE", "THE"];
        let expected = [["APPLE", 2], ["SAMSUNG", 1], ["THE", 1]];

        expect(countOccurrences(input)).toEqual(expected);
    });

    it('should return an empty array', function() {
        let transformPostsToArray = app.__get__('transformPostsToArray');

        expect(transformPostsToArray()).toEqual([]);
    }); 

    it('should return an array of sanitized titles', function() {
        let transformPostsToArray = app.__get__('transformPostsToArray');

        let input = [
            { data: { title: "Lizards11 people invade" }},
            { data: { title: "coffee_is delicious!" }}
        ];

        let expected = [ "LIZARDS11", "PEOPLE", "INVADE", "COFFEEIS", "DELICIOUS" ];

        expect(transformPostsToArray(input)).toEqual(expected);
    }); 

    it('should return -1 for non-existent keys', function() {
        let findIndexByKey = app.__get__('findIndexByKey');
        let array = [["CAT", 4], ["DOG", 5], ["BIRD", 2]];
        expect(findIndexByKey(array, "LIZARD")).toBe(-1);
    });

    it('should find the array index for the key', function() {
        let findIndexByKey = app.__get__('findIndexByKey');
        let array = [["CAT", 4], ["DOG", 5], ["BIRD", 2]];
        expect(findIndexByKey(array, "DOG")).toBe(1);
    });
});
