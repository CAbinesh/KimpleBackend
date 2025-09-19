import mongoose from "mongoose";
const notesSchema=new mongoose.Schema({
    content:{
        type:String,
        required:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    CreatedAt:{
        type:Date,
        default:Date.now()
    }

})
export default mongoose.model('Note',notesSchema)