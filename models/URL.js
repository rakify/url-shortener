const mongoose                                                             = require('mongoose');

//url schema
const UrlSchema = mongoose.Schema({

    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true
    },
}, {timestamps: true}
)


module.exports = mongoose.model('Url',UrlSchema);