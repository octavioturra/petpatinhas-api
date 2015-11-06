var models = require('../models');

export function breeds() {
    return models.Breed.findAll({
        where: {
            status: STATUS.BLOCKED
        }
    });
}

function create_animal(animal) {
    return models.Animal.create({
        name: animal.name,
        kind: animal.kind || KIND.DOG,
        profilePicture: animal.profilePictureUrl || DEFAULT_PICTURE
    });
}

function create_profile(animal) {
    return models.AnimalProfile.create({
        birthYear: animal.birthYear,
        genre: animal.genre||GENRE.UNKNOWN,
        size: animal.size || SIZE.UNKNOWN,
        mood: animal.mood || MOOD.UNKNOWN,
        primaryColor: animal.primaryColor,
        secundaryColor: animal.secundaryColor
    })
}

function create_relationship(animal, user_id, relationship_type) {

}

export function create(animal_data, user_id, relationship_type = 1) {
    if (!animal_data) {
        throw new Error('empty animal data');
    }

}
