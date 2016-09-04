/**
 * Schema User
 * Created by Constantine on 21.07.2016.
 */
module.exports = exports = function User(mongoose) {

    var Schema = mongoose.Schema,
        crypto = require('crypto'),
        cache = require('../../server/cache')();


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
    /**
     * Получить авторизованного пользователя, если такой есть и пароль верный
     * @param {object} user - хэш пользователя
     * @param {string} user.login - логин пользователя
     * @param {string} user.password - пароль пользователя
     * @param {vow.defer|function} next - callback
     */
    User.statics.getAuthUser = function (user, next) {
        //TODO: проверка на пустоту user'a
        var key = 'user_' + user.login + "_" + user.password;
        if (cache.exists(key)) next.resolve? next.resolve(cache.get(key)): next(cache.get(key));
        else {
            this.findOne({ Login : user.login }, function (err, doc) {
                if (err) {
                    if (next.reject) next.reject(err);
                    else throw err;
                }
                doc && doc.checkPassword(user.password) && cache.set(key, doc);
                next.resolve? next.resolve(cache.get(key)): next(cache.get(key));
            });
        }
    };

    return mongoose.model('User', User);
};