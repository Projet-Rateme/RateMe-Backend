import  mongoose  from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'User',
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'Comment',
        }
    ],
    image: {
        type: String,
    },
    content: {
        type: String,
        required: 'Kindly enter the content of the post'
    },
}, {
    timestamps: true
});


const Post = mongoose.model("post", postSchema);
export { Post };