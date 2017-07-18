const Client = require('node-rest-client').Client;

const client = new Client();
const filterWords = require('./filter-words');
const resourceUrl = "https://www.reddit.com/r/${subreddit}/top.json"

/**
 * Allows this file to be called as a command line script. This will take the
 * subreddit name as a CLI argument and call the same function that the lambda
 * handler function would call
 */
if (require.main === module) {

    let subreddit;

    // if called from the cli, subreddit will be the 3rd arg
    if (process.argv.length === 3) {
        subreddit = process.argv[2];
    }

    buildSubredditWordOccurrences(subreddit, function(error, success) {
        if (error) {
            console.error(error);
        } else {
            console.log(success);
        }
    });
}

/**
 * Handle AWS lambda trigger
 * @param event AWS trigger event
 * @param context the lambda environment context
 * @param callback the lambda callback function that will be called with the
 *      response
 */
exports.lambdaHandler = function(event, context, callback) {
    buildSubredditWordOccurrences(event.subreddit, callback);
}

/**
 * Builds an array of title word occurences from the given subreddit, and calls
 * the given callback function with either an error or success. the callback
 * should accept two parameters error, and success message.
 *
 * @param subreddit the string representing a subreddit, e.g. 'all' for
 *      https://reddit.com/r/all
 * @param callback function to execute when the process is complete
 */
function buildSubredditWordOccurrences(subreddit, callback) {

    const requestOptions = {
        path: { subreddit: subreddit ? subreddit : 'all' },
        parameters: { sort: "top", t: "week", "count": 500 },
        headers: { "Content-Type": "application/json", "Accept": "application/json" }
    };

    let response = {
        isBase64Encoded: false,
        headers: {},
    };

    let request = client.get(resourceUrl, requestOptions, data => {
        let words = transformPostsToArray(data.data.children);

        response.statusCode = 200;
        response.body = JSON.stringify(countOccurrences(words, filterWords));

        callback(null, response);
    });

    request.on('error', (err) => {
        console.error(err);
        
        response.statusCode = 500;
        response.body = `error loading reddit data: ${err}`;

        callback(response, null);
    });

}

/**
 * Takes an array of words, and reduces it to an array of key/values pairs
 * representing each unique word, and the number of occurrences. Any words to
 * filter out included in the filters will not be included, and the array
 * will be sorted by number of occurrences
 * eg: ["APPLE", "SAMSUNG", "APPLE", "THE"] => [["APPLE", 2], ["SAMSUNG", 1]]
 *
 * @param array the array of words to reduce
 * @param filters the array of words to filter out
 * @return array of key value pairs
 */
function countOccurrences(words, filters = []) {
    let counts = words.reduce((acc, word) => {

        if (!filters.includes(word)) {
            let index = findIndexByKey(acc, word);

            if (index === -1) {
                acc.push([word, 1]);
            } else {
                acc[index][1]++;
            }
        }

        return acc;
    },[]);

    counts.sort((a, b) => b[1] - a[1]);

    return counts;
}

/**
 * Takes a response body from reddit of the posts in a subreddit, and transforms
 * it into an array containing
 * alphanumeric words from post titles
 *
 * @param response the response from reddit
 * @return array of post title words
 */
function transformPostsToArray(posts = []) {
    return posts.reduce((acc, post) => {
        return acc.concat(post.data.title
                .toUpperCase()
                .replace(/[^A-Z0-9 ]/g, '')
                .split(' '));
    }, []);
}

/**
 * Returns the index of the array with the given key, if the key does not exist
 * this function will return -1
 *
 * @param array the array to search
 * @param key the key to search the array for
 * @return index of key if exists, otherwise -1
 */
function findIndexByKey(array, key) {
    for (let i=0; i < array.length; i++) {
        if (array[i][0] === key) {
            return i;
        }
    }

    return -1;
}

