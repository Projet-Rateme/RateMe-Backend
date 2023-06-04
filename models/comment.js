import  mongoose  from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: 'Kindly enter the content of the comment'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'User',
        }
    ],
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'Comment',
        }
    ],
}, {
    timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);
export { Comment };