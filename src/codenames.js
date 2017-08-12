import * as _ from 'lodash';

import logger from './logger';
import {intAsChars, intAsColorString} from './counters';
import {entitiesToReplace} from './constants';

var defaultCodenamingCounters = {
    PERSON: intAsChars,
    ORGANIZATION: intAsColorString,
    LOCATION: i => i
};
/**
 * 
 * Returns an array of arrays, containing an entity and it's assigned codename, e.g.
 * 
 * [
 *     ['Tom', 'Person-A'].
 *     ['Tescos', 'Organization-Aquamarine'],
 *     ['London', 'Location-1']
 * ]
 * 
 * @param {*} entities An entites object returned by Stanford NER
 */
var provideCodenames = (entities, codenamingCounters = defaultCodenamingCounters) => {
    logger('Providing codenames');
    var codenames = [];
    entitiesToReplace.map(namedEntityType => {
        var foundEntities = entities[namedEntityType];
        var codenamingCounter = codenamingCounters[namedEntityType];
        if (codenamingCounter) {
            logger('Codenaming %ss', namedEntityType);
            if (foundEntities) {
                var uniqueEntities = _.uniq(foundEntities);
                uniqueEntities.map((entity, i) => {
                    var codenameStatic = _.startCase(_.lowerCase(namedEntityType));
                    var codenameDynamic = codenamingCounters[namedEntityType](i);
                    var codename = `${codenameStatic}-${codenameDynamic}`;
                    var codenamePair = {entity: entity, codename: codename};
                    logger('Provided codename %j', codenamePair);
                    codenames.push(codenamePair);
                });
            }
        } else {
            logger(`Codenaming function for ${namedEntityType} not found. Anonymization will be incomplete`);
        }
    });
    return codenames;
};

export {provideCodenames};