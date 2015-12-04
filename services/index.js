import * as constants from '../models/constants';

export function constant(constantName) {
    return _.invert(constants[constantName.toUpperCase()]);
}
