
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
        stem = intAsDict((i / dictLength >> 0) -1, recursiveDictionary || dictionary, undefined)
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
var intAsCharString = (i) => {
    return intAsDict(i, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

/**
 * Convert an integer into a character representation, e.g.
 * 
 * 0 => Aqua
 * 50 => Yellow
 * 51 => AntiqueAqua
 * 
 * @param {int} i 
 */
var intAsColorString = (i) => {
    var dictionary = [
        'Aqua',
        'Aquamarine',
        'Azure',
        'Beige',
        'Bisque',
        'Black',
        'Blue',
        'Brown',
        'Chartreuse',
        'Chocolate',
        'Coral',
        'Cornsilk',
        'Crimson',
        'Cyan',
        'Fuchsia',
        'Gainsboro',
        'Gold',
        'Gray',
        'Grey',
        'Green',
        'Indigo',
        'Ivory',
        'Khaki',
        'Lavender',
        'Lime',
        'Linen',
        'Magenta',
        'Maroon',
        'Moccasin',
        'Navy',
        'Olive',
        'Orange',
        'Orchid',
        'Peru',
        'Pink',
        'Plum',
        'Purple',
        'Red',
        'Salmon',
        'Sienna',
        'Silver',
        'Snow',
        'Tan',
        'Teal',
        'Thistle',
        'Tomato',
        'Turquoise',
        'Violet',
        'Wheat',
        'White',
        'Yellow'
    ];
    var recursiveDictionary = [
        'Antique',
        'Blanched',
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

export {intAsCharString, intAsColorString};