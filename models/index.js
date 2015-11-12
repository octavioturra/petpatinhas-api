var Sequelize = require('sequelize');
var DataTypes = require('sequelize');

var databaseConfig = {
    dialect: 'sqlite',
    storage: 'db.sqlite'
};
var sequelize = new Sequelize('database', 'u', 'p', databaseConfig);

var baseModel = {
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
};

var User = sequelize.define('User', {
    name: Sequelize.STRING,
    ...baseModel
});

var Animal = sequelize.define('Animal', {
    name: Sequelize.DATE,
    kind: Sequelize.INTEGER,
    profilePictureUrl: Sequelize.STRING,
    ...baseModel
});

var AnimalProfile = sequelize.define('AnimalProfile', {
    birthYear: Sequelize.INTEGER,
    genre: Sequelize.INTEGER,
    size: Sequelize.INTEGER,
    mood: Sequelize.INTEGER,
    primaryColor: Sequelize.INTEGER,
    secundaryColor: Sequelize.INTEGER
});

var Breed = sequelize.define('Breed', {
    name: Sequelize.INTEGER
});

var Relationship = sequelize.define('Relationship', {
    origin: Sequelize.INTEGER,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    ...baseModel
});

var Like = sequelize.define('Like', {
    ...baseModel
});

var Follow = sequelize.define('Follow', {
    ...baseModel
});


AnimalProfile.belongsTo(Animal);
AnimalProfile.hasOne(Breed);
Relationship.belongsTo(Animal);
Relationship.belongsTo(User);
Like.belongsTo(Animal);
Like.belongsTo(User);
Follow.belongsTo(Animal);
Follow.belongsTo(User);

module.exports = {
    User: User,
    Animal: Animal,
    AnimalProfile: AnimalProfile,
    Breed: Breed,
    Relationship: Relationship,
    Like: Like,
    Follow: Like,
    sync: ()=> sequelize.sync()
};
