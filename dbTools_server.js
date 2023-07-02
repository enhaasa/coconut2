function convertSQLKeyword (word) {
    return "`" + word + "`";
};

function convertSQLKeywords (words) {
    return words.map(word => (convertSQLKeyword(word)))
};

module.exports = {
    convertSQLKeyword,
    convertSQLKeywords
};