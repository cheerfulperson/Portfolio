const User = require('../models/user.model');

const getAll = async () => {
    return User.find({});
}

const getOne = async options => {
    return User.findOne(options);
}

const addOne = async user => {
    return User.create(user);
}

const updateOne = async (filter, data) => {
    return User.updateOne(filter, data);
}

module.exports = { getAll, getOne, addOne, updateOne }