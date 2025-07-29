import mongoose from "mongoose";
import { User } from "./User.js";

const serviceSchema = new mongoose.Schema({
    // name: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,  
    category: String,
   
    description: String,
    location: String,
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {type:Number, default:0},
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    approved: {
  type: Boolean,
  default: false
}
,
   
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment:{
                type: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                }

            }
        }
    ]

});

export const Service = mongoose.model('Service', serviceSchema);
