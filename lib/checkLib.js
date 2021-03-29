let trim = (x) => {
    let value = String(x)
    //replaces all whitespace characters in a given value
    return value.replace(/^\s+|\s+$/gm, '')
}

let isEmpty = (value) => {
    if(value === null || value === undefined || value.length === 0 || trim(value) === '') {
        return true
    } else {
        return false
    }
} //returns boolean value

/**
 * exporting these functions to use in other modules
 */
module.exports = {
    trim : trim,
    isEmpty : isEmpty
}