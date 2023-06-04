import  mongoose  from "mongoose";
const { Schema, model } = mongoose;

const tokenSchema = new Schema({
    email : {
        type: String,
        required: true
    },
    code : {
        type: String,
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        expires: 604800
    }

}, {
    timestamps: true
});

const Token = mongoose.model("Token", tokenSchema);
export { Token };
