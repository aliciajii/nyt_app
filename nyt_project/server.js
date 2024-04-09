const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

// create a MongoDb model for articles
const Article = require('./models/article');
const app = express();

const API_KEY = 'pTzBbuoAKUHKzF0QRgXzFXo5OxaLA5UT';
const MONGODB = 'mongodb+srv://aliciaji:5Vcmucvw$@cluster0.lf4btad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// connect to mongodb
mongoose.connect(MONGODB).then(()=>console.log('db connected') );

app.use(express.json());

// get the most popular articles
app.get('/api/most-popular', async (req,res) => {
    try {
        let articles = await Article.find({});
        
        // check if there are any articles alreadyh stored in database
        if (articles.length === 0) {
           // if no articles stored, then use API save to database 
            const response = await axios.get('https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=pTzBbuoAKUHKzF0QRgXzFXo5OxaLA5UT');
            articles = response.data.results.map(article => ({
                title: article.title,
                abstract: article.abstract,
                url: article.url,
            }));
            await Article.insertMany(articles);
        }
        // return the articles
        res.json(articles)
    } catch (error) {
        console.error('Error: could not get data from NYT', error);
        res.status(500).json({ error: 'Could not get data'});
    }
});

const PORT = 3000

app.listen(PORT, () => {
    console.log('Server running on port 3000!');
});

// connect to and get data from database
app.get('/api/getdata', async (req, res) =>{
    try{
        const data=await Article.find();
        res.json(data);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});