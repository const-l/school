/**
 * Schema Page
 * Created by Constantine on 21.07.2016.
 */
module.exports = exports = function Page(mongoose) {

    var Schema = mongoose.Schema;

    var Page = new Schema({
        Content : { type : String },
        Author  : { type : Schema.Types.ObjectId, ref : 'User' },
        Modifier: { type : Schema.Types.ObjectId, ref : 'User' }
    }, { timestamps : { createdAt : 'CreatedOn', updatedAt : 'ModifiedOn' }});

    /**
     * Обновление контента в базе
     * @param {string} id - id записи для обновления
     * @param {string} content - данные
     * @param {object} user - хэш текущего пользователя
     * @param {string} user.Id - Id текущего пользователя
     * @param {vow.defer|function} next - callback
     */
    Page.statics.saveContent = function (id, content, user, next) {
        this.findById(id, function (err, doc) {
            if (err) {
                if (next.reject) next.reject(err);
                else throw err;
            }
            else if (doc) {
                doc.Content = content;
                doc.Modifier = user.Id;
                doc.save(function (err) {
                    if (err) {
                        if (next.reject) next.reject(err);
                        else throw err;
                    }
                    else next.resolve? next.resolve(): next();
                });
            }
            else {
                if (next.reject) next.reject('Page not found');
                else throw new Error('Page not found');
            }
        });
    };

    return mongoose.model('Page', Page);
};