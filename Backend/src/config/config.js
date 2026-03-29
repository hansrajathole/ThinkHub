import dotenv from 'dotenv';
dotenv.config();

const _config = {
    MONGODB_URI : process.env.MONGODB_URI || 'mongodb://localhost:27017/SackWave',
    PORT : process.env.PORT || 3000,
    JWT_SECRET : process.env.JWT_SECRET ,
    JWT_EXPAIRE_IN : process.env.JWT_EXPAIRE_IN ,
    REDIS_USERNAME : process.env.REDIS_USERNAME,
    REDIS_HOST : process.env.REDIS_HOST,
    REDIS_PORT : process.env.REDIS_PORT,
    REDIS_PASSWORD : process.env.REDIS_PASSWORD  ,
    JUDGE0_API_KEY : process.env.JUDGE0_API_KEY,
    JUDGE0_API_URL : process.env.JUDGE0_API_URL ,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    IMAGEKIT_PUBLIC_KEY : process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY : process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL: process.env.IMAGEKIT_URL, 
    BASE_URL: process.env.BASE_URL,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL,
}

const config = Object.freeze(_config)
export default config
