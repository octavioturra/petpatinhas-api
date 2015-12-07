import * as constant from '../models/constants';
import * as _ from 'lodash';
var models = require('../models');

export function breeds() {
    return models.Breed.findAll({
        where: {
            status: constant.STATUS.ACTIVE
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

function consolidateAnimal(animals) {
    return animals
        .map((a) => ({
            id: a.id,
            name: a.name,
            kind: a.kind,
            origin: a.origin,
            followers: a.follows,
            likes: a.likes
        }));
};

const querySnippets = {
    follows : ', (SELECT count(1) FROM follows f WHERE animalId = a.id AND f.status = 1) follows',
    likes : ', (SELECT count(1) FROM likes l WHERE animalId = a.id AND l.status = 1) likes',
}

const queries = {
    byId: `SELECT
              a.id,
              a.name,
              a.kind,
              a.profilePictureUrl,
              ap.birthYear,
              ap.genre,
              ap.mood,
              ap.primaryColor,
              ap.secundaryColor,
              ap.size,
              r.city,
              r.state,
              r.origin
              ${querySnippets.follows}
              ${querySnippets.likes}
          FROM
              Animals a
              INNER JOIN AnimalProfiles ap
                  ON ap.AnimalId = a.id
              INNER JOIN Relationships r
                  ON r.AnimalId = a.id and r.status = 1
              WHERE
                  a.status = 1
                  AND a.id = ?
              ORDER BY
                  a.createdAt desc
    `,
    byUser: `SELECT
            a.id
            , a.name
            , a.kind
            , r.origin
            ${querySnippets.follows}
            ${querySnippets.likes}
        FROM Animals a
        INNER JOIN relationships r ON r.animalId = a.id
        INNER JOIN users u ON r.userId = u.id
        WHERE u.id = ?
            AND a.status = ?
            AND u.status = ?
        ORDER BY a.id DESC
        LIMIT ?
        OFFSET ?`,
    byKind: `SELECT
            a.id
            , a.name
            , a.kind
            , r.origin
            ${querySnippets.follows}
            ${querySnippets.likes}
        FROM Animals a
        INNER JOIN relationships r ON r.animalId = a.id
        INNER JOIN users u ON r.userId = u.id
        WHERE a.kind = ?
            AND a.status = ?
            AND u.status = ?
        ORDER BY a.id DESC
        LIMIT ?
        OFFSET ?`,
    byOrigin: `SELECT
            a.id
            , a.name
            , a.kind
            , r.origin
            ${querySnippets.follows}
            ${querySnippets.likes}
        FROM Animals a
        INNER JOIN relationships r ON r.animalId = a.id
        INNER JOIN users u ON r.userId = u.id
        WHERE r.origin = ?
            AND a.status = ?
            AND u.status = ?
        ORDER BY a.id DESC
        LIMIT ?
        OFFSET ?`,
}

export function get(id){
  return models.db.query(queries.byId, {
          replacements: [parseInt(id, 10)],
          type: models.db.QueryTypes.SELECT
      })
      .then((a)=>a[0]);
}

function list(query, id, page=1, pageSize=30, status = constant.STATUS.ACTIVE){
    return models.db.query(query, {
            replacements: [parseInt(id, 10), status, status, pageSize, pageSize * (page - 1)],
            type: models.db.QueryTypes.SELECT
        })
        .then(consolidateAnimal);
}

export function listByUser(userId, page=1, pageSize=30, status = constant.STATUS.ACTIVE) {
    return list(queries.byUser, userId, page, pageSize, status);
}

export function listByKind(kindId, page=1, pageSize=30, status = constant.STATUS.ACTIVE){
    return list(queries.byKind, kindId, page, pageSize, status);
}

export function listByOrigin(origin, page=1, pageSize=30, status = constant.STATUS.ACTIVE){
    return list(queries.byOrigin, page, pageSize, status);
}
