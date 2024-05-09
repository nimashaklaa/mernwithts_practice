import { InferSchemaType, model, Schema } from "mongoose";

const noteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true }); // this timestamp should be outside of curly braces
//this string should write in uppercase: because these are constructors of these types

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);
// "Note" is the name of the collection , this will later create a collection in mongodb database,but it turns this into a plural, so
// by calling this "Note" it will create a collection with the name notes