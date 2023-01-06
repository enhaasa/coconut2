function convertSQLKeyword (word) {
    const keywords = [
        'table', 
        'name',
        'time',
        'type',
        'session',
        'date',
        'floor'
    ];

    return keywords.includes(word)
        ? "`" + keywords[keywords.indexOf(word)] + "`" 
        : word;
};

function convertSQLKeywords (words) {
    return words.map(word => (convertSQLKeyword(word)))
};

module.exports = {
    convertSQLKeyword,
    convertSQLKeywords
};