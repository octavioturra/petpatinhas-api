var models = require('../models');

export function create(facebook_profile) {
    return models.User.create({
        id: facebook_profile.id,
        name: facebook_profile.displayName
    });
};

export function get(id) {
    console.log('>>>get', id);
    return models.User.findOne({
        where: {
            id: id
        }
    });
};
