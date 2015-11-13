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

function userRelationships(userId, status) {
    return models.Relationship.findAll({
        include: [{
            model: models.Animal
        }],
        where: {
            UserId: userId,
            status
        }
    });
};

function consolidateAnimal(a){
    return {
        id : a.id,
        name : a.name,
        kind : a.kind
    };
};

function consolidateRelationship(r){
    return consolidateAnimal(r.Animal);
};

function animalFromRelationship(relationships){
    return relationships
        .filter((r)=>r.Animal)
        .map(consolidateRelationship);
}

function relationshipAnimal(relationships) {
    return Promise.all(animalFromRelationship(relationships));
};

export function getByUser(userId, status = constant.STATUS.ACTIVE) {
    return userRelationships(userId, status)
        .then(relationshipAnimal);
};

function animalsByKind(kindId, status){
    return models.Animal.findAll({
        where: {
            kind: kindId,
            status
        }
    });
}

function animalFromQuery(animals){
    return Promise.all(animals.map(consolidateAnimal));
}

export function getByKind(kindId, status = constant.STATUS.ACTIVE) {
    return animalsByKind(kindId, status)
        .then(animalFromQuery);
};
