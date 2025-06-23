import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

const advertSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
    },
    image:{
        type: String,
    
    },
    category:{
        type: String,
        enum:['Tech & Programming',
      'Artisans',
      'Food & Beverages',
      'Education & Training',
      'Virtual Assistants'],
        required: true
    },
    user:{
        type: Schema.Types.ObjectId, ref: 'User'
    }
},{timestamps: true});

advertSchema.plugin(normalize)
export const Advert = model('Advert',advertSchema)