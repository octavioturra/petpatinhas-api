var Sequelize = require('sequelize');
var DataTypes = require('sequelize');
var sequelize = new Sequelize('database', 'u', 'p', {
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

var baseModel = {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
};

var User = sequelize.define('User', {
  ...baseModel,
  id: Sequelize.INTEGER,
    name: Sequelize.STRING
});

var Animal = sequelize.define('Animal', {
  name: Sequelize.DATE,
  kind: Sequelize.INTEGER,
  profilePictureUrl: Sequelize.STRING,
  ...baseModel
});

var AnimalProfile = sequelize.define('Animal', {
  birthYear: Sequelize.INTEGER,
  genre: Sequelize.INTEGER,
  size: Sequelize.INTEGER,
  mood: Sequelize.INTEGER,
  primaryColor: Sequelize.INTEGER,
  secundaryColor: Sequelize.INTEGER
});

var Breed = sequelize.define('Animal', {
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


AnimalProfile.hasOne(Animal, {
  foreignKey: 'animal_id',
  as: 'animalId'
});
AnimalProfile.hasOne(Breed, {
  foreignKey: 'breed_id',
  as: 'breedId'
});
Relationship.hasOne(Animal, {
  foreignKey: 'animal_id',
  as: 'animalId'
});
Relationship.hasOne(User, {
  foreignKey: 'user_id',
  as: 'userId'
});
Like.hasOne(Animal, {
  foreignKey: 'animal_id',
  as: 'animalId'
});
Like.hasOne(User, {
  foreignKey: 'user_id',
  as: 'userId'
});
Follow.hasOne(Animal, {
  foreignKey: 'animal_id',
  as: 'animalId'
});
Follow.hasOne(User, {
  foreignKey: 'user_id',
  as: 'userId'
});


sequelize.sync();

module.exports = {
  User: User,
  Animal: Animal,
  AnimalProfile: AnimalProfile,
  Breed: Breed,
  Relationship: Relationship,
  Like: Like,
  Follow: Like
};
