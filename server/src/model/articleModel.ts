import mongoose from "mongoose";
const Schema = mongoose.Schema;

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName:{
        type:String,
        required: true,
    },
    authorEmail:{
        type:String,
        required: true,
        lowercase: true,

    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'published', 'approved'], 
        default: 'draft'
      },
    editStatus:{
        type:String,
        enum: ['draft', 'pending', 'published'],
        default:'draft'
    },
    editRequest: {
        title: String,
        content: String,
        editStatus: String
    },
    editApproved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    publishedAt: {
        type: Date
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    likesCount: {
        type: Number,
        default: 0
    },
    dislikes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    dislikesCount: {
        type: Number,
        default: 0
    }
});


const Articles = mongoose.model('Article', articleSchema);
export default Articles;