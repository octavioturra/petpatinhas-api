import * as constant from '../models/constants';
var models = require('../models');

export function liking(userId){
    return models.Like.findAll({
        include: [{
            model: models.User,
            where: { status: constant.STATUS.ACTIVE, id: userId }
        }, {
            model: models.Animal,
            where: { status: constant.STATUS.ACTIVE},
            include: [{model: models.Relationship, where: {status: constant.STATUS.ACTIVE}}]
        }],
        where: { status: constant.STATUS.ACTIVE }
    }).map((l)=>{
        let animal = l.getAnimal();
        return {
            id: animal.id,
            name: animal.name,
            kind: animal.kind,
            origin: l.origin,
            followers: l.follows,
            likes: l.likes
        };
    });
}
export function likedBy(animalId){
    return models.Like.findAll({
        include: [{
            model: models.User,
            where: { status: constant.STATUS.ACTIVE}
        }, {
            model: models.Animal,
            where: { status: constant.STATUS.ACTIVE, id: animalId },
            include: [{model: models.Relationship, where: {status: constant.STATUS.ACTIVE}}]
        }],
        where: { status: constant.STATUS.ACTIVE }
    });
}
export function like(userId, animalId){
    return models.Like.create({
        UserId: userId,
        AnimalId: animalId
    });
}
export function unlike(userId, animalId){
    models.Like.findOne({
        where: {
            UserId: userId,
            AnimalId: animalId
        }
    }).then((like)=>{
        like.status = constant.STATUS.REMOVED
        return like.save();
    });
}

export function following(userId){
    return models.Follow.findAll({
        include: [{
            model: models.User,
            where: { status: constant.STATUS.ACTIVE, id: userId }
        }, {
            model: models.Animal,
            where: { status: constant.STATUS.ACTIVE, id: animalId },
            include: [{model: models.Relationship, where: {status: constant.STATUS.ACTIVE}}]
        }],
        where: { status: constant.STATUS.ACTIVE }
    });
}
export function followedBy(animalId){
    return models.Follow.findAll({
        include: [{
            model: models.User,
            where: { status: constant.STATUS.ACTIVE}
        }, {
            model: models.Animal,
            where: { status: constant.STATUS.ACTIVE, id: animalId },
            include: [{model: models.Relationship, where: {status: constant.STATUS.ACTIVE}}]
        }],
        where: { status: constant.STATUS.ACTIVE }
    });
}
export function follow(userId, animalId){
    return models.Follow.create({
        UserId: userId,
        AnimalId: animalId
    });
}
export function unfollow(userId, animalId){
    models.Follow.findOne({
        where: {
            UserId: userId,
            AnimalId: animalId
        }
    }).then((follow)=>{
        follow.status = constant.STATUS.REMOVED;
        return follow.save();
    });
}
