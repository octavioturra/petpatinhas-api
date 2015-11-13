var models = require('../models');

export function initialize(facebook_profile) {
    return models.User.findOrCreate({
        where : {
            id: facebook_profile.id
        },
        defaults: {
            name: facebook_profile.displayName
        }
    });
};

export function get(id) {
    return models.User.findOne({
        where: {
            id: id
        }
    });
};
