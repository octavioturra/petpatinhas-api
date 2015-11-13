import * as constant from '../models/constants';
var models = require('../models');

export function breeds() {
    return models.Breed.findAll({
        where: {
            status: STATUS.BLOCKED
        }
    });
};

function createAnimal(animal, action = 'create') {
    return models.Animal[action]({
        name: animal.name,
        kind: animal.kind || constant.KIND.DOG,
        profilePicture: animal.profilePictureUrl || constant.DEFAULT_PICTURE
    });
};

function createProfile(animal, action = 'create') {
    return (a) => models.AnimalProfile[action]({
        birthYear: animal.birthYear,
        genre: animal.genre || constant.GENRE.UNKNOWN,
        size: animal.size || constant.SIZE.UNKNOWN,
        mood: animal.mood || constant.MOOD.UNKNOWN,
        primaryColor: animal.primaryColor,
        secundaryColor: animal.secundaryColor,
        BreedId: animal.breedId || constant.UNKNOWN,
        AnimalId: a.id
    });
};

function createRelationship(animal, userId, relationship = constant.ORIGIN.OWNER, action = 'create') {
    return (a) => models.Relationship[action]({
        origin: relationship,
        city: animal.city,
        state: animal.state,
        UserId: userId,
        AnimalId: a.AnimalId
    });
};

export function create(animalData, userId) {
    if (!animalData) {
        throw new Error('empty animal data');
    }
    return createAnimal(animalData)
        .then(createProfile(animalData))
        .then(createRelationship(animalData, userId, animalData.relationship));
};

function userRelationships(userId) {
    return models.Relationship.forAll({
        where: {
            UserId: userId
        }
    });
};

function userRelationships(userId) {
    return models.Relationship.findAll({
        include: [{
            model: models.Animal
        }],
        where: {
            UserId: userId,
            status: 1
        }
    });
};

function consolidate(r){
    let Animal = r.Animal;
    console.log(Animal, 'Animal<<<')
    return {
        id : Animal.id,
        name : Animal.name,
        kind : Animal.kind
    };
};

function animalFromRelationship(relationships){
    return relationships
        .filter((r)=>r.Animal)
        .map(consolidate);
}

function relationshipAnimal(relationships) {
    return Promise.all(animalFromRelationship(relationships));
};

export function getByUser(userId, status = constant.STATUS.ACTIVE) {
    return userRelationships(userId)
        .then(relationshipAnimal);
};

export function getByKind(kindId, status = constant.STATUS.ACTIVE) {
    return models.Animal.findAll({
        where: {
            kind: kindId
        }
    });
};
