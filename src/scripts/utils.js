
const strIsNullOrEmpty = (str) => str == null || str === '';
const strIsNullOrWhitespace = (str) => str == null || str === '' || str === ' ';

export {
    strIsNullOrEmpty,
    strIsNullOrWhitespace
}