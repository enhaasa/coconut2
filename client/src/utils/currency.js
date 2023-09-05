export function formatStringAsPrice(str) {
    const reversedStr = str.split('').reverse().join(''); // reverse the input string
    const regex = /(\d{3})(?=\d)/g; // use regex to match every three digits
    const withCommas = reversedStr.replace(regex, '$1,'); // insert commas after every three digits
    return withCommas.split('').reverse().join(''); // reverse the string again and return
}