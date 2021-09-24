const User = require('../models/user.model');

class DBModelController {
    constructor(Model = {}){
        this.Model = Model;
    }
    async getAll(filds){
        return this.Model.find({}, filds);
    }
    async searchAll(options, filds){
        return this.Model.find(options, filds);
    }
    async getOne(options) {
        return this.Model.findOne(options);
    }
    async addOne(user) {
        return this.Model.create(user);
    }
    async updateOne(filter, data){
        return this.Model.updateOne(filter, data);
    }
    
}

module.exports = DBModelController;