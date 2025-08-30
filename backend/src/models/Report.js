import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
    }
    
}, { timestamps: true }); // createdAt, updatedAt

const Report = mongoose.model('Report', reportSchema);
export default Report;