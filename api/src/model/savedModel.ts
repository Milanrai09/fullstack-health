import mongoose from "mongoose";

const SavedSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Article',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const Saved = mongoose.model('Saved', SavedSchema);
export default Saved;