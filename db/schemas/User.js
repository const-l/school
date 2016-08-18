/**
 * Schema User
 * Created by Constantine on 21.07.2016.
 */
module.exports = exports = function User(mongoose) {

    var Schema = mongoose.Schema,
        crypto = require('crypto');


    var User = new Schema({
        Name            : { type : String, required : true },
        Login           : { type : String, required : true },
        HashedPassword  : { type : String, required : true },
        Salt            : { type : String, required : true },
        IsAdmin         : { type : Boolean, default : false }
    });
    User.virtual('Password')
        .set(function (password) {
            this.Salt = crypto.randomBytes(32).toString('base64');
            this.HashedPassword = this.encryptPassword(password);
        });

    /**
     * Шифрование пароля
     * @param {String} password - пароль
     * @returns {String}
     */
    User.methods.encryptPassword = function (password) {
        return crypto.createHmac('sha1', this.Salt).update(password).digest('hex');
    };
    /**
     * Проверка пароля
     * @param {String} password - пароль
     * @returns {Boolean}
     */
    User.methods.checkPassword = function (password) {
        return this.encryptPassword(password) === this.HashedPassword;
    };

    return mongoose.model('User', User);
};