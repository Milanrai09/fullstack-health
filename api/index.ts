require('dotenv').config();
// src/server.ts
import express, { response,Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fetchChatGPTResponse } from './openaiService';
import fetch from 'node-fetch';
const app = express();
const port = process.env.PORT
app.use(bodyParser.json());
app.use(cors());
import { Request, Response } from 'express';
import mongdbConnection from './databaseconfig';
import User from './src/model/userModal';
import Articles from './src/model/articleModel'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import Saved from './src/model/savedModel'
import axios, { AxiosRequestConfig } from 'axios';

import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

import {tokenMiddleware } from './src/middleware/userMiddleware'

import { isAdminMiddleware} from './src/middleware/adminMiddleware'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // 


interface CorsConfig {
  origin: string;
  credentials: boolean;
  methods: string[];
}

const corsOptions = {
    credentials: true,
   origin:'*'
};
    // origin: ['https://fullstack-health.vercel.app'] 

app.use(cors(corsOptions)); 



  app.use(cookieParser());

  // Use only for JSON parsing
  app.use(bodyParser.json());

  // Only if required for form data
  app.use(bodyParser.urlencoded({ extended: true }));

  // CORS configuration




app.use(express.json());
app.use(cookieParser());

const secretkey = process.env.JWT_SECRET

mongdbConnection();
console.log(port)
// Define the shape of your food details data
interface FoodDetails {
    fdcId: number; // Example, adjust the type according to your API response
    name: string;
    calories: number;
    
    // Add more fields as per your API response
  }
           
                
app.get('/',(req, res) => {
    res.send('hello world')
});


  app.post('/api/user/google-signup', async (req: Request, res: Response) => {
    const { token } = req.body;
    console.log('hello',token)
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ error: 'Invalid token' });
      }
  
      const { sub: googleId, email, name, picture } = payload;
  
      // Check if user already exists
      let user = await User.findOne({ $or: [{ googleId }, { email }] });
  
      if (user) {
        // If user exists but doesn't have a googleId, update it
        if (!user.googleId) {
          user.googleId = googleId;
          user.authProvider = 'google';
          await user.save();
          return res.status(409).json({message:'user already exist'})

        }else{
          console.log('user already exist')
          return res.status(409).json({message:'user already exist'})
        }
      } else {
        // Create new user
        user = new User({
          name,
          email,
          googleId,
          picture,
          authProvider: 'google',
          isAdmin: false,
          isSuperAdmin: false,
        });
        await user.save();
      }
  
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
  
      // Generate JWT token
      const jwtToken = jwt.sign(
        { 
          userId: user._id, 
          isAdmin: user.isAdmin, 
          isSuperAdmin: user.isSuperAdmin 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      const userData = {
        userId: user._id,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        token: jwtToken,
      };
  
      // Set token as HTTP cookie
      res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
      return res.status(200).json({ message: 'Google sign-up successful', userData });
    } catch (error) {
      console.error('Error in Google sign-up:', error);
      return res.status(500).json({ error: 'Server error during Google sign-up' });
    }
  });






app.get('/api/nutrition', async (req: Request, res: Response) => {
  const apiKey = process.env.NUTRITION_KEY;
  const foodQuery = req.query.food as string;
  if (!foodQuery) {
    return res.status(400).json({ error: 'Food query parameter is required' });
  }
                  
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(foodQuery)}`;

    try {
      console.log(`Fetching from search URL: ${searchUrl}`);
      // First fetch: Search for foods matching the query
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from search endpoint, status: ${response.status}`);
      }
      const data = await response.json() as { foods?: FoodDetails[] }; // Type assertion or explicit typing
      
      console.log('Search response data:', data);
      
      if (data.foods && data.foods.length > 0) {
        // Extract the first food item from the search results
        const firstFood = data.foods[0];
    const fdcId = firstFood.fdcId;

    const detailsUrl = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`;
    console.log(`Fetching from details URL: ${detailsUrl}`);
    // Second fetch: Get detailed information for the specific food item
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      throw new Error(`Failed to fetch food details from details endpoint, status: ${detailsResponse.status}`);
    }
    const foodDetails = await detailsResponse.json() as FoodDetails; // Type assertion or explicit typing
    console.log('Food details response data:', foodDetails);
    
    // Respond with the detailed nutritional information
    res.json(foodDetails);
  } else {
    // No food items found
    res.status(404).json({ error: 'No food data found' });
  }
} catch (error) {
    // Handle errors
    console.error('Error fetching data:', (error as Error).message); // Type assertion for error
    res.status(500).json({ error: 'Error fetching data', details: (error as Error).message });
  }
});



app.post('/api/users/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already in use:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,  // The password will be hashed in the pre-save hook
      isAdmin: true,
      isSuperAdmin: true,
      authProvider: 'local',  // Set the auth provider to 'local'
    });

    // Save the new user
    const saveResponse = await newUser.save();
    if(!saveResponse){
      console.log('error in saveRespone ')
    }
    console.log('New user saved:', newUser._id);

    if (!secretkey) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        isAdmin: newUser.isAdmin, 
        isSuperAdmin: newUser.isSuperAdmin 
      },
      secretkey,
      { expiresIn: '1h' }
        );
    console.log('Token generated:', token);

    const userData = {
      userId: newUser._id,
      isAdmin: newUser.isAdmin,
      isSuperAdmin: newUser.isSuperAdmin,
      token,
    };


    console.log('Cookie set attempt completed');

    return res.status(200).json({ message: 'Registered successfully', userData });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/users/getAllUser', async (req: Request, res: Response) => {
  try {

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/promote/:id',tokenMiddleware,isAdminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;


    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      user.isAdmin = true;
      await user.save();
      return res.status(200).json({ message: 'User promoted to admin successfully' });
    } else {
      return res.status(400).json({ message: 'User is already an admin' });
    }

  } catch (error) {
    console.error('Error promoting user', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/demote/:id',tokenMiddleware,isAdminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAdmin) {
      user.isAdmin = false;
      await user.save();
      return res.status(200).json({ message: 'User demoted from admin successfully' });
    } else {
      return res.status(400).json({ message: 'User is not an admin' });
    }

  } catch (error) {
    console.error('Error demoting user', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/user/google-signup', async (req: Request, res: Response) => {
  const { token, username } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Check if the user already exists
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    
    if (user) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create a new user account
    user = new User({
      name,
      email,
      googleId,
      picture,
      username,
      authProvider: 'google',
      isAdmin: false,
      isSuperAdmin: false,
    });
    await user.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const jwtPayload = {
      userId: user._id,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
    };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userData = {
      userId: user._id,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      token: jwtToken,
    };

    // Set token as HTTP cookie
    res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return res.status(201).json({ message: 'Registered successfully', userData });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/user/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if it's a local auth user
    if (user.isLocalAuth()) {
      if (!user.password) {
        return res.status(400).json({ error: 'Invalid authentication method' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
    } else {
      // For Google-authenticated users, we might want to handle this differently
      return res.status(400).json({ error: 'Please use Google Sign-In for this account' });
    }

    if (!secretkey) {
      throw new Error('Secret key is not defined');
    }
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin },
      secretkey,
      { expiresIn: '1h' }
    );
    const userData = {
      userId: user._id,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      token
    }

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Signed in successfully', userData });
  } catch (error) {
    console.error('Error signing in', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/save',async(req,res)=> {
  try{
    const{productId,userId} = req.body
    const saveInfo = await new Saved({
      productId:productId,
      userId:userId
    })

    const savedresponse =  await saveInfo.save();
    if(!savedresponse){
      res.status(424).json({error:'saving not succesfull'})
    }
    res.status(200).json({message:'saved successfull'})

  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
})




app.get('/article/getAllArticle', async(req,res) => {
  try{
    const getArticle = await Articles.find();
    if(!getArticle){
      res.status(424).json({error:'saving not succesfull'})

    }
    res.status(200).json(getArticle);

  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
})
app.post('/api/article/create',tokenMiddleware, async (req: Request, res: Response) => {
  const { title, category, content, userId } = req.body;

  if (!title || !category || !content) {
    return res.status(400).send({ error: 'Title, category, and content are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const article = new Articles({
      title,
      category,
      content,
      authorId: userId,
      authorName: user.name,
      authorEmail: user.email,
      status: 'draft',
      editRequest: {}, // Initialize editRequest here
    });

    await article.save();
    res.status(201).send(article);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Error creating article' });
  }
});

app.delete('/api/article/delete/:id', async (req: Request, res: Response) => {
  try {
    const ArticlesId = req.params.id;

    const Articlesres = await Articles.findByIdAndDelete(ArticlesId);

    if (!Articlesres) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting Articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/article/like', async (req: Request, res: Response) => {
  try {
    const articlesId = req.body.articleId;
    const userId = req.body.userId;
    console.log(userId,articlesId)

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Valid UserId is required' });
    }

    const article = await Articles.findById(articlesId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user has already liked the article
    const alreadyLiked = article.likes.some(like => like.user?.toString() === userId);
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You have already liked this article' });
    }

    // Check if user has disliked the article
    const dislikeIndex = article.dislikes.findIndex(dislike => dislike.user?.toString() === userId);
    if (dislikeIndex > -1) {
      // Remove dislike
      article.dislikes.splice(dislikeIndex, 1);
      article.dislikesCount = Math.max(0, article.dislikesCount - 1);
    }

    // Add like
    article.likes.push({ user: new mongoose.Types.ObjectId(userId) });
    article.likesCount += 1;

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Dislike an article
app.put('/article/dislike', async (req: Request, res: Response) => {
  try {
    const {articleId, userId} = req.body
    console.log(userId,articleId)

    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    const article = await Articles.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user has already disliked the article
    const alreadyDisliked = article.dislikes?.some(dislike => dislike.user?.toString() === userId);
    if (alreadyDisliked) {
      return res.status(400).json({ message: 'You have already disliked this article' });
    }

    // Check if user has liked the article
    const likeIndex = article.likes?.findIndex(like => like.user?.toString() === userId) ?? -1;
    if (likeIndex > -1) {
      // Remove like
      article.likes?.splice(likeIndex, 1);
      article.likesCount = Math.max(0, (article.likesCount ?? 0) - 1);
    }

    // Add dislike
    article.dislikes = article.dislikes || [];
    article.dislikes.push({ user: userId });
    article.dislikesCount = (article.dislikesCount ?? 0) + 1;

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error disliking article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.put('/article/update-status/:id', async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const { status } = req.body;



    // Validate the status
    if (!['draft', 'pending', 'published'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const article = await Articles.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Update the status
    article.status = status;

    // If the status is being set to 'published', update the publishedAt date
    if (status === 'published' && article.status !== 'published') {
      article.publishedAt = new Date();
    }

    // Save the updated article
    const updatedArticle = await article.save();

    res.json({
      message: 'Article status updated successfully',
      article: updatedArticle
    });

  } catch (error) {
    console.error('Error updating article status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






app.put('/article/update-status-edit/:id', async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const { status, editStatus } = req.body;

    const validStatuses = ['draft', 'pending', 'published'];

    // Validate the statuses
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    if (editStatus && !validStatuses.includes(editStatus)) {
      return res.status(400).json({ message: 'Invalid editStatus' });
    }

    const article = await Articles.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Update the statuses if provided
    if (status) {
      article.status = status;
      // If the status is being set to 'published', update the publishedAt date
      if (status === 'published' && article.status !== 'published') {
        article.publishedAt = new Date();
      }
    }

    if (editStatus) {
      article.editStatus = editStatus;
    }

    // Save the updated article
    const updatedArticle = await article.save();

    res.json({
      message: 'Article statuses updated successfully',
      article: updatedArticle
    });

  } catch (error) {
    console.error('Error updating article statuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.put('/api/articles/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;

    const article = await Articles.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          category,
          content,
          editStatus: 'draft'
        }
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json({ message: 'Article updated successfully' });
  } catch (error) {

  }
});



app.post('/api/articles/save',tokenMiddleware, async (req, res) => {
  try {
    const { userId, articleId } = req.body;
    
    // Check if this specific article is already saved by this user
    const existingSave = await Saved.findOne({ userId: userId, articleId: articleId });
    
    if (existingSave) {
      return res.status(409).json({ message: 'Article already saved by this user' });
    }
    
    // If not saved, create a new save entry
    const savedRes = await Saved.create({
      articleId: articleId,
      userId: userId,
    });

    await savedRes.save();
    res.status(200).json({ message: "Article saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/articles/getsaved',async (req, res) => {
  try {
    const userId = req.query.userId;
    
    const savedRecords = await Saved.find({ userId: userId });
    if (!savedRecords || savedRecords.length === 0) {
      return res.status(404).json({ success: false, error: 'No saved articles found for this user' });
    }
    
    const articleIds = savedRecords.map(record => record.articleId);
   

    // Change findOne to find to get all matching articles
    const articles = await Articles.find({ _id: { $in: articleIds } });
    if (!articles || articles.length === 0) {
      return res.status(404).json({ success: false, error: 'No articles found' });
    }
    console.log("get the articles", articles);

    // Send all articles in the response
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});




//new articles query 


app.post('/api/articles/edit', async (req: Request, res: Response) => {
  const { title, content,id } = req.body;
  try {
    const article = await Articles.findByIdAndUpdate(id, {
      $set: {
        'editRequest.title': title,
        'editRequest.content': content,
        'editRequest.editStatus': 'draft',
        editApproved: false 
      }
    }, { new: true });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error editing article' });
  }
});



// Reject edit endpoint
app.patch('/articles/:id/edit/reject', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const article = await Articles.findByIdAndUpdate(id, {
      $set: {
        editApproved: false,
        'editRequest.editStatus': 'draft'
      }
    }, { new: true });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error rejecting edit' });
  }
});

// Get article endpoint
app.get('/articles/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const article = await Articles.findById(id);
    if (article?.editApproved) {
      res.json({
        title: article.title,
        content: article.content
      });
    } else {
      res.json({
        title: article?.editRequest?.title || article?.title,
        content: article?.editRequest?.content || article?.content
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching article' });
  }
});



app.delete('/api/articles/delete/:id', async (req: Request, res: Response) => {
  try {
    const deleteUser = await Articles.findByIdAndDelete(req.params.id)
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "User deletion successful" })
  } catch (error) {
    console.error('Error deleting user', error);
    res.status(500).json({ error: 'Server error' });
  }
})

app.delete('/api/users/deleteArticle',tokenMiddleware,isAdminMiddleware, async (req: Request, res: Response) => {
  try {
    const { articleId, userId } = req.body
    const article = await Articles.findById(articleId)
    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }
    if (article.authorId.toString() === userId.toString()) {
      await Articles.findByIdAndDelete(articleId)
      res.status(200).json({ message: "Article deletion successful" })
    } else {
      res.status(403).json({ message: "Unauthorized to delete this article" })
    }
  } catch (error) {
    console.error('Error deleting article', error);
    res.status(500).json({ error: 'Server error' });
  }
})


app.put('/api/articles/approveEdit/:id',tokenMiddleware,isAdminMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('Approving edit for article:', req.params.id);
    
    const article = await Articles.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (!article.editRequest) {
      return res.status(400).json({ error: 'No pending edit request' });
    }

    // Update the main article fields with the edit request data
    article.title = article.editRequest.title || article.title;
    article.content = article.editRequest.content || article.content;
    article.editApproved = true;
    article.editStatus = 'published';

    // Clear the edit request
    article.editRequest = undefined;

    // Save the updated article
    const updatedArticle = await article.save();

    res.status(200).json({ message: "Article updated successfully", article: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/articles/approveCreate/:id',tokenMiddleware,isAdminMiddleware, async (req: Request, res: Response) => {
  try{
   const approve = "approved"
    await Articles.findByIdAndUpdate(req.params.id, {
     $set: {
  
       status: approve
     }
   }, { new: true });

   res.status(200).json({ message: "Article updated successfully" });
  }catch(error){
    console.error('Error updating article', error);
    res.status(500).json({ error: 'Server error' });
  }
})




app.delete('/api/users/deleteUser/:id', tokenMiddleware,isAdminMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('hello frm teh detet ')
    const deleteUser = await User.findByIdAndDelete(req.params.id)
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "User deletion successful" })
  } catch (error) {
    console.error('Error deleting user', error);
    res.status(500).json({ error: 'Server error' });
  }
})




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




app.get('/api/nutrition/:search', async (req: Request, res: Response) => {

    const apiKey = process.env.NUTRITION_KEY;
  
  const input = req.params.search;


  if (!input) {
    return res.status(400).json({ message: 'Input parameter is required' });
  }

  try {
    const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        api_key: apiKey,
        query: input,
        dataType: ['Survey (FNDDS)'],
        pageSize: 1
      },
      paramsSerializer: (params: any) => {
        return Object.entries(params)
          .map(([key, value]: [string, any]) => {
            if (Array.isArray(value)) {
              return value.map((v: string) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          })
          .join('&');
      }
    });

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      const servingSize = food.servingSize || 100; // Default to 100g if serving size is not provided
      const servingUnit = food.servingUnit || 'g';
      const conversionFactor = 100 / servingSize;

      const nutrients: { [key: string]: string } = food.foodNutrients.reduce((acc: { [key: string]: string }, nutrient: any) => {
        // Convert nutrient value to 100g equivalent
        const value = nutrient.value * conversionFactor;
        acc[nutrient.nutrientName] = `${value.toFixed(2)} ${nutrient.unitName}`;
        return acc;
      }, {});

      res.json({
        foodName: food.description,
        servingSize: '100g',
        nutrients: nutrients
      });
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error: any) {
    console.error('Error fetching food data:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching food data', error: error.message });
  }
});






// app.post('/api/chat', async (req, res) => {
//   const { messages } = req.body;

//   try {
//     const response = await fetchChatGPTResponse(messages);
//     console.log('message:', response)
//     res.json({ response });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     res.status(500).json({ error: errorMessage });
//   }
// });

