/**
 * Schema Page
 * Created by Constantine on 21.07.2016.
 */
module.exports = exports = function Page(mongoose) {

    var Schema = mongoose.Schema;

    var Page = new Schema({
        Caption : { type : String, required : true },
        Content : { type : String },
        Author  : { type : Schema.Types.ObjectId, ref : 'User' },
        Preview : { type : String }
    }, { timestamps : { createdAt : 'CreatedOn', updatedAt : 'ModifiedOn' }});

    return mongoose.model('Page', Page);
};