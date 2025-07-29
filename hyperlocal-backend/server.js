import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';




dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",  
  Withcredentials: true                
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));






// These are the auth api end point
app.use('/api/auth', authRoutes);
// these are service api end point
app.use('/api/services', serviceRoutes);

// register bookings api end point
app.use('/api/bookings', bookingRoutes);

// this is for the review api end point
app.use('/api/reviews', reviewRoutes);

app.use("/api/providers", providerRoutes);
// app.use("/api/users", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/services", serviceRoutes);

app.use('/api/payment', paymentRoutes);
// This is for connected to MongoDB database and PORT
const PORT = process.env.PORT || 8888;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, ()=> console.log(`Server Is Running on Port ${PORT}`));
})
.catch((err)=> console.log(err));