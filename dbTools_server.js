const convertSQLKeyword = (word) => {
    const keywords = [
        'table', 
        'name',
        'time',
        'type',
        'session',
        'date'
    ];

    return keywords.includes(word)
        ? "`" + keywords[keywords.indexOf(word)] + "`" 
        : word;
};

const convertSQLKeywords = (array) => (
    array.map(word => (convertSQLKeyword(word)))
);

module.exports = {
    convertSQLKeyword,
    convertSQLKeywords
};