function convertSQLKeyword (word) {
    return "`" + word + "`";
};

function convertSQLKeywords (words) {
    return words.map(word => (convertSQLKeyword(word)))
};

function pgConvertSQLKeyword (word) {
    return '"' + word + '"';
}

function pgConvertSQLKeywords (words) {
    return words.map(word => (pgConvertSQLKeyword(word)))
}

module.exports = {
    convertSQLKeyword,
    convertSQLKeywords,
    pgConvertSQLKeyword,
    pgConvertSQLKeywords
};