import dotenv from 'dotenv';

// Loads environment files into process.env
dotenv.config();

export const PORT = process.env.PORT || 7508

export const mongoURI = process.env.MONGO_URI

export const secret = process.env.JWT_SECRET

export const SMTP_USER = process.env.SMTP_USER

export const SMTP_PASS = process.env.SMTP_PASS