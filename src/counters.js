import logger from './logger';

/**
 * Convert an integer into a character representation, e.g.
 * 
 * 0 => A
 * 26 => Z
 * 27 => AZ
 * 
 * @param {int} i 
 * @param {string[]|string} dictionary
 * @param {string[]|string|undefined} recursiveDictionary If not given, uses dictionary
 */
var intAsDict = (i, dictionary, recursiveDictionary) => {
    var dictLength = dictionary.length;
    var stem = '';
    // if greater than length of the dictionary, recurse
    if (i >= dictLength ) {
        stem = intAsDict((i / dictLength >> 0) -1, recursiveDictionary || dictionary, undefined);
    }
    // otherwise, convert
    var leaf = dictionary[i % dictLength >> 0];
    // return concatenated value
    return `${stem}${leaf}`;
};

/**
 * Convert an integer into a character representation, e.g.
 * 
 * 0 => A
 * 26 => Z
 * 27 => AZ
 * 
 * @param {int} i 
 */
var intAsChars = (i) => {
    logger.silly('Converting integer to characters');
    return intAsDict(i, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

/**
 * Convert an integer into a character representation, e.g.
 * 
 * 0 => Aquamarine
 * 35 => Yellow
 * 
 * @param {int} i 
 */
var intAsColorString = (i) => {
    logger.silly('Converting integer to color');
    var dictionary = [
        'Aquamarine',
        'Azure',
        'Beige',
        'Black',
        'Blue',
        'Brown',
        'Chocolate',
        'Coral',
        'Crimson',
        'Cyan',
        'Fuchsia',
        'Gold',
        'Gray',
        'Green',
        'Indigo',
        'Ivory',
        'Khaki',
        'Lavender',
        'Lime',
        'Magenta',
        'Maroon',
        'Navy',
        'Olive',
        'Orange',
        'Pink',
        'Plum',
        'Purple',
        'Red',
        'Salmon',
        'Silver',
        'Tan',
        'Teal',
        'Turquoise',
        'Violet',
        'White',
        'Yellow'
    ];
    var recursiveDictionary = [
        'Antique',
        'Dark',
        'Deep',
        'Dim',
        'Hot',
        'Light',
        'Medium',
        'Pale',
        'Powder',
        'Royal',
        'Slate'
    ];
    return intAsDict(i, dictionary, recursiveDictionary);
};

export {intAsChars, intAsColorString};