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

    return mongoose.model('Page', Page);
};