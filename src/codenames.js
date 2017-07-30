import * as _ from 'lodash';

import {intAsCharString, intAsColorString} from './counters';
import {entitiesToReplace} from './constants';

var defaultCodenamingCounters = {
    PERSON: intAsCharString,
    ORGANIZATION: intAsColorString,
    LOCATION: i => i
};
/**
 * 
 * Returns an array of arrays, containing an entity and it's assigned codename, e.g.
 * 
 * [
 *     ['Tom', 'Person-A'].
 *     ['Tescos', 'Organization-Aqua'],
 *     ['London', 'Location-1']
 * ]
 * 
 * @param {*} entities An entites object returned by Stanford NER
 */
var provideCodenames = (entities, codenamingCounters = defaultCodenamingCounters) => {
    var codenames = [];
    entitiesToReplace.map(namedEntityType => {
        var foundEntities = entities[namedEntityType];
        var codenamingCounter = codenamingCounters[namedEntityType];
        if (codenamingCounter) {
            if (foundEntities) {
                var uniqueEntities = _.uniq(foundEntities);
                uniqueEntities.map((entity, i) => {
                    var codenameStatic = _.startCase(_.lowerCase(namedEntityType));
                    var codenameDynamic = codenamingCounters[namedEntityType](i);
                    var codename = `${codenameStatic}-${codenameDynamic}`;
                    codenames.push({entity: entity, codename: codename});
                });
            }
        } else {
            console.warn(`Codenaming function for ${namedEntityType} not found. Anonymization will be incomplete`);
        }
    });
    return codenames;
};

export {provideCodenames};