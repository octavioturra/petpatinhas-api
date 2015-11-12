import * as constant from '../models/constants';
var models = require('../models');

export function breeds() {
    return models.Breed.findAll({
        where: {
            status: STATUS.BLOCKED
        }
    });
}

function create_animal(animal, action = 'create') {
    return models.Animal[action]({
        name: animal.name,
        kind: animal.kind || constant.KIND.DOG,
        profilePicture: animal.profilePictureUrl || constant.DEFAULT_PICTURE
    });
}

function create_profile(animal, action = 'create') {
    return (a) => models.AnimalProfile[action]({
        birthYear: animal.birthYear,
        genre: animal.genre || constant.GENRE.UNKNOWN,
        size: animal.size || constant.SIZE.UNKNOWN,
        mood: animal.mood || constant.MOOD.UNKNOWN,
        primaryColor: animal.primaryColor,
        secundaryColor: animal.secundaryColor,
        breedId: animal.breedId || constant.UNKNOWN,
        animalId: a.uuuid
    });
}

function create_relationship(animal, userId, relationship = constant.ORIGIN.OWNER, action = 'create') {
    return (a) => models.Relationship[action]({
        origin: relationship,
        city: animal.city,
        state: animal.state,
        userId: userId,
        animalId: a.animalId
    });
}

export function create(animalData, userId) {
    if (!animalData) {
        throw new Error('empty animal data');
    }
    return create_animal(animalData)
        .then(create_profile(animalData))
        .then(create_relationship(animalData, userId, animalData.relationship));
}
