import axios from "axios";


const apiClient = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });




export default apiClient;

// // src/server.ts
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { Request, Response } from 'express';
// import mongdbConnection from './databaseconfig';
// import User from './src/model/userModal';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';
// import Saved from './src/model/savedModel';
// import Articles from './src/model/articleModel';
// import mongoose from 'mongoose';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 9000;

// app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(cors());

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// mongdbConnection();

// // Define the shape of your food details data
// interface FoodDetails {
//     fdcId: number; // Example, adjust the type according to your API response
//     name: string;
//     calories: number;
    
//     // Add more fields as per your API response
//   }
                
                
// app.get('/api/nutrition', async (req: Request, res: Response) => {
//   const apiKey = 'xdxnkuMYxh6VcAm5mbcbPAP76alFUNicjT6Q8l7i';  
//   const foodQuery = req.query.food as string;
//   if (!foodQuery) {
//     return res.status(400).json({ error: 'Food query parameter is required' });
//   }
                  
//     const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(foodQuery)}`;

//     try {
//       console.log(`Fetching from search URL: ${searchUrl}`);
//       // First fetch: Search for foods matching the query
//       const response = await fetch(searchUrl);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch data from search endpoint, status: ${response.status}`);
//       }
//       const data = await response.json() as { foods?: FoodDetails[] }; // Type assertion or explicit typing
      
//       console.log('Search response data:', data);
      
//       if (data.foods && data.foods.length > 0) {
//         // Extract the first food item from the search results
//         const firstFood = data.foods[0];
//     const fdcId = firstFood.fdcId;

//     const detailsUrl = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`;
//     console.log(`Fetching from details URL: ${detailsUrl}`);
//     // Second fetch: Get detailed information for the specific food item
//     const detailsResponse = await fetch(detailsUrl);
//     if (!detailsResponse.ok) {
//       throw new Error(`Failed to fetch food details from details endpoint, status: ${detailsResponse.status}`);
//     }
//     const foodDetails = await detailsResponse.json() as FoodDetails; // Type assertion or explicit typing
//     console.log('Food details response data:', foodDetails);
    
//     // Respond with the detailed nutritional information
//     res.json(foodDetails);
//   } else {
//     // No food items found
//     res.status(404).json({ error: 'No food data found' });
//   }
// } catch (error) {
//     // Handle errors
//     console.error('Error fetching data:', (error as Error).message); // Type assertion for error
//     res.status(500).json({ error: 'Error fetching data', details: (error as Error).message });
//   }
// });




// app.post('/api/user/register', async (req: Request, res: Response) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       isAdmin: false,
//       isSuperAdmin: false,
//     });

//     // Save the new user
//     await newUser.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: newUser._id, isAdmin: newUser.isAdmin, isSuperAdmin: newUser.isSuperAdmin },
//       JWT_SECRET,
//       { expiresIn: '1800s' }
//     );

//     const userData = {
//       userId: newUser._id,
//       isAdmin: newUser.isAdmin,
//       isSuperAdmin: newUser.isSuperAdmin,
//       token,
//     };

//     // Set token as HTTP cookie
//     res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

//     return res.status(201).json({ message: 'Register successfully', userData });
//   } catch (error) {
//     console.error('Error registering user', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// app.get('/api/users/getAllUser', async (req: Request, res: Response) => {
//   try {

//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error retrieving users', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// app.delete('/api/users/deleteUser/:id', async (req: Request, res: Response) => {
//   try {
//     console.log("hello")
//     const deleteUser = await User.findByIdAndDelete(req.params.id)
//     if (!deleteUser) {
//       return res.status(404).json({ message: "User not found" })
//     }
//     res.status(200).json({ message: "User deletion successful" })
//   } catch (error) {
//     console.error('Error deleting user', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// })


// app.post('/api/user/login' , async(req:Request,res:Response) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }



//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     const userData ={
//       userId:user._id,
//       isAdmin:user.isAdmin,
//       isSuperAdmin:user.isSuperAdmin,
//       token
//     }

//     res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//     res.json({ message: 'Signed in successfully',userData });
//   } catch (error) {
//     console.error('Error signing in', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: {
//       _id: string;
//       // Add other user properties if necessary
//     };
//   }
// }



// app.post('/api/save',async(req,res)=> {
//   try{
//     const{productId,userId} = req.body
//     const saveInfo = await new Saved({
//       productId:productId,
//       userId:userId
//     })

//     const savedresponse =  await saveInfo.save();
//     if(!savedresponse){
//       res.status(424).json({error:'saving not succesfull'})
//     }
//     res.status(200).json({message:'saved successfull'})

//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// })


// // Articles endpoint 

// app.get('/article/getAllArticle', async(req,res) => {
//   try{
//     const getArticle = await Articles.find();
//     if(!getArticle){
//       res.status(424).json({error:'saving not succesfull'})

//     }
//     res.status(200).json(getArticle);

//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// })
// app.post('/api/article/create', async (req: Request, res: Response) => {
//   const { title, category, content, userId } = req.body;
//   console.log('hello from article create')

//   if (!title || !category || !content) {
//     return res.status(400).send({ error: 'Title, category, and content are required' });
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send({ error: 'User not found' });
//     }

//     const article = new Articles({
//       title,
//       category,
//       content,
//       authorId: userId,
//       authorName: user.name,
//       authorEmail: user.email,
//       status: 'draft',
//       editRequest: {}, // Initialize editRequest here
//     });

//     await article.save();
//     res.status(201).send(article);
//   } catch (error) {
//     console.error(error);
//     res.status(400).send({ error: 'Error creating article' });
//   }
// });

// app.delete('/api/article/delete/:id', async (req: Request, res: Response) => {
//   try {
//     const ArticlesId = req.params.id;

//     const Articlesres = await Articles.findByIdAndDelete(ArticlesId);

//     if (!Articlesres) {
//       return res.status(404).json({ message: 'Article not found' });
//     }

//     res.json({ message: 'Article deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting Articles:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.put('/api/article/like', async (req: Request, res: Response) => {
//   try {
//     const articlesId = req.body.articleId;
//     const userId = req.body.userId;

//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'Valid UserId is required' });
//     }

//     const article = await Articles.findById(articlesId);
//     if (!article) {
//       return res.status(404).json({ message: 'Article not found' });
//     }

//     // Check if user has already liked the article
//     const alreadyLiked = article.likes.some(like => like.user?.toString() === userId);
//     if (alreadyLiked) {
//       return res.status(400).json({ message: 'You have already liked this article' });
//     }

//     // Check if user has disliked the article
//     const dislikeIndex = article.dislikes.findIndex(dislike => dislike.user?.toString() === userId);
//     if (dislikeIndex > -1) {
//       // Remove dislike
//       article.dislikes.splice(dislikeIndex, 1);
//       article.dislikesCount = Math.max(0, article.dislikesCount - 1);
//     }

//     // Add like
//     article.likes.push({ user: new mongoose.Types.ObjectId(userId) });
//     article.likesCount += 1;

//     const updatedArticle = await article.save();
//     res.json(updatedArticle);
//   } catch (error) {
//     console.error('Error liking article:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// // Dislike an article
// app.put('/article/dislike', async (req: Request, res: Response) => {
//   try {
//     const {articleId, userId} = req.body
//     if (!userId) {
//       return res.status(400).json({ message: 'UserId is required' });
//     }

//     const article = await Articles.findById(articleId);
//     if (!article) {
//       return res.status(404).json({ message: 'Article not found' });
//     }

//     // Check if user has already disliked the article
//     const alreadyDisliked = article.dislikes?.some(dislike => dislike.user?.toString() === userId);
//     if (alreadyDisliked) {
//       return res.status(400).json({ message: 'You have already disliked this article' });
//     }

//     // Check if user has liked the article
//     const likeIndex = article.likes?.findIndex(like => like.user?.toString() === userId) ?? -1;
//     if (likeIndex > -1) {
//       // Remove like
//       article.likes?.splice(likeIndex, 1);
//       article.likesCount = Math.max(0, (article.likesCount ?? 0) - 1);
//     }

//     // Add dislike
//     article.dislikes = article.dislikes || [];
//     article.dislikes.push({ user: userId });
//     article.dislikesCount = (article.dislikesCount ?? 0) + 1;

//     const updatedArticle = await article.save();
//     res.json(updatedArticle);
//   } catch (error) {
//     console.error('Error disliking article:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });




// app.put('/article/update-status/:id', async (req: Request, res: Response) => {
//   try {
//     const articleId = req.params.id;
//     const { status } = req.body;



//     // Validate the status
//     if (!['draft', 'pending', 'published'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const article = await Articles.findById(articleId);
//     if (!article) {
//       return res.status(404).json({ message: 'Article not found' });
//     }

//     // Update the status
//     article.status = status;

//     // If the status is being set to 'published', update the publishedAt date
//     if (status === 'published' && article.status !== 'published') {
//       article.publishedAt = new Date();
//     }

//     // Save the updated article
//     const updatedArticle = await article.save();

//     res.json({
//       message: 'Article status updated successfully',
//       article: updatedArticle
//     });

//   } catch (error) {
//     console.error('Error updating article status:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });






// app.put('/article/update-status-edit/:id', async (req: Request, res: Response) => {
//   try {
//     const articleId = req.params.id;
//     const { status, editStatus } = req.body;

//     const validStatuses = ['draft', 'pending', 'published'];

//     // Validate the statuses
//     if (status && !validStatuses.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }
//     if (editStatus && !validStatuses.includes(editStatus)) {
//       return res.status(400).json({ message: 'Invalid editStatus' });
//     }

//     const article = await Articles.findById(articleId);
//     if (!article) {
//       return res.status(404).json({ message: 'Article not found' });
//     }

//     // Update the statuses if provided
//     if (status) {
//       article.status = status;
//       // If the status is being set to 'published', update the publishedAt date
//       if (status === 'published' && article.status !== 'published') {
//         article.publishedAt = new Date();
//       }
//     }

//     if (editStatus) {
//       article.editStatus = editStatus;
//     }

//     // Save the updated article
//     const updatedArticle = await article.save();

//     res.json({
//       message: 'Article statuses updated successfully',
//       article: updatedArticle
//     });

//   } catch (error) {
//     console.error('Error updating article statuses:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });



// app.put('/api/articles/update/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, category, content } = req.body;

//     const article = await Articles.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           title,
//           category,
//           content,
//           editStatus: 'draft'
//         }
//       },
//       { new: true }
//     );

//     if (!article) {
//       return res.status(404).json({ error: 'Article not found' });
//     }

//     res.status(200).json({ message: 'Article updated successfully' });
//   } catch (error) {

//   }
// });



// app.post('/api/articles/save', async (req, res) => {
//   try {
//     const { userId, articleId } = req.body;
    
//     // Check if this specific article is already saved by this user
//     const existingSave = await Saved.findOne({ userId: userId, articleId: articleId });
    
//     if (existingSave) {
//       return res.status(409).json({ message: 'Article already saved by this user' });
//     }
    
//     // If not saved, create a new save entry
//     const savedRes = await Saved.create({
//       articleId: articleId,
//       userId: userId,
//     });

//     await savedRes.save();
//     res.status(200).json({ message: "Article saved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// app.get('/api/articles/getsaved', async (req, res) => {
//   try {
//     const userId = req.query.userId;
    
//     const savedRecords = await Saved.find({ userId: userId });
//     if (!savedRecords || savedRecords.length === 0) {
//       return res.status(404).json({ success: false, error: 'No saved articles found for this user' });
//     }
    
//     const articleIds = savedRecords.map(record => record.articleId);
   

//     // Change findOne to find to get all matching articles
//     const articles = await Articles.find({ _id: { $in: articleIds } });
//     if (!articles || articles.length === 0) {
//       return res.status(404).json({ success: false, error: 'No articles found' });
//     }
//     console.log("get the articles", articles);

//     // Send all articles in the response
//     res.json({ success: true, data: articles });
//   } catch (error) {
//     console.error('Error fetching saved articles:', error);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// });




// //new articles query 


// app.post('/api/articles/edit', async (req: Request, res: Response) => {
//   const { title, content,id } = req.body;
//   try {
//     const article = await Articles.findByIdAndUpdate(id, {
//       $set: {
//         'editRequest.title': title,
//         'editRequest.content': content,
//         'editRequest.editStatus': 'draft'
//       }
//     }, { new: true });
//     res.json(article);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error editing article' });
//   }
// });

// // Approve edit endpoint
// app.patch('/articles/:id/edit/approve', async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const article = await Articles.findByIdAndUpdate(id, {
//       $set: {
//         title: '$editRequest.title',
//         content: '$editRequest.content',
//         editApproved: true,
//         'editRequest.editStatus': 'approved'
//       }
//     }, { new: true });
//     res.json(article);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error approving edit' });
//   }
// });

// // Reject edit endpoint
// app.patch('/articles/:id/edit/reject', async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const article = await Articles.findByIdAndUpdate(id, {
//       $set: {
//         editApproved: false,
//         'editRequest.editStatus': 'draft'
//       }
//     }, { new: true });
//     res.json(article);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error rejecting edit' });
//   }
// });

// // Get article endpoint
// app.get('/articles/:id', async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const article = await Articles.findById(id);
//     if (article?.editApproved) {
//       res.json({
//         title: article.title,
//         content: article.content
//       });
//     } else {
//       res.json({
//         title: article?.editRequest?.title || article?.title,
//         content: article?.editRequest?.content || article?.content
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching article' });
//   }
// });


// app.delete('/api/articles/delete/:id', async (req: Request, res: Response) => {
//   try {
//     console.log("hello")
//     const deleteUser = await Articles.findByIdAndDelete(req.params.id)
//     if (!deleteUser) {
//       return res.status(404).json({ message: "User not found" })
//     }
//     res.status(200).json({ message: "User deletion successful" })
//   } catch (error) {
//     console.error('Error deleting user', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// })

// app.delete('/api/users/deleteArticle', async (req: Request, res: Response) => {
//   try {
//     console.log("hello")
//     const { articleId, userId } = req.body
//     const article = await Articles.findById(articleId)
//     if (!article) {
//       return res.status(404).json({ message: "Article not found" })
//     }
//     if (article.authorId === userId) {
//       await Articles.findByIdAndDelete(articleId)
//       res.status(200).json({ message: "Article deletion successful" })
//     } else {
//       res.status(403).json({ message: "Unauthorized to delete this article" })
//     }
//   } catch (error) {
//     console.error('Error deleting article', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// })



// app.put('/api/articles/approveEdit/:id', async (req: Request, res: Response) => {
//   try {

//      await Articles.findByIdAndUpdate(req.params.id, {
//       $set: {
//         content: req.body.editRequest.content,
//         title: req.body.editRequest.title,
//         editStatus: req.body.editRequest.editStatus,
//         editApproved: true
//       }
//     }, { new: true });

//     res.status(200).json({ message: "Article updated successfully" });
//   } catch (error) {
//     console.error('Error updating article', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// })



// app.put('/api/articles/approveCreate/:id', async (req: Request, res: Response) => {
//   try{
//    const approve = "approved"
//     await Articles.findByIdAndUpdate(req.params.id, {
//      $set: {
  
//        status: approve
//      }
//    }, { new: true });

//    res.status(200).json({ message: "Article updated successfully" });
//   }catch(error){
//     console.error('Error updating article', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }



// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// interface FoodDetails {
//   fdcId: number;
//   name: string;
//   calories: number;
//   // Add more fields as per your API response
// }
// app.get('/api/nutrition', async (req: Request, res: Response) => {
//   const apiKey = 'xdxnkuMYxh6VcAm5mbcbPAP76alFUNicjT6Q8l7i';
//   const { input } = req.query;

//   if (!input) {
//     return res.status(400).json({ message: 'Input parameter is required' });
//   }

//   try {
//     const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
//       params: {
//         api_key: apiKey,
//         query: input,
//         dataType: ['Survey (FNDDS)'],
//         pageSize: 1
//       },
//       paramsSerializer: (params: any) => {
//         return Object.entries(params)
//           .map(([key, value]: [string, any]) => {
//             if (Array.isArray(value)) {
//               return value.map((v: string) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
//             }
//             return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
//           })
//           .join('&');
//       }
//     });

//     if (response.data.foods && response.data.foods.length > 0) {
//       const food = response.data.foods[0];
//       const servingSize = food.servingSize || 100; // Default to 100g if serving size is not provided
//       const servingUnit = food.servingUnit || 'g';
//       const conversionFactor = 100 / servingSize;

//       const nutrients: { [key: string]: string } = food.foodNutrients.reduce((acc: { [key: string]: string }, nutrient: any) => {
//         // Convert nutrient value to 100g equivalent
//         const value = nutrient.value * conversionFactor;
//         acc[nutrient.nutrientName] = `${value.toFixed(2)} ${nutrient.unitName}`;
//         return acc;
//       }, {});

//       res.json({
//         foodName: food.description,
//         servingSize: '100g',
//         nutrients: nutrients
//       });
//     } else {
//       res.status(404).json({ message: 'Food not found' });
//     }
//   } catch (error: any) {
//     console.error('Error fetching food data:', error.response ? error.response.data : error.message);
//     res.status(500).json({ message: 'Error fetching food data', error: error.message });
//   }
// });

// // app.post('/api/chat', async (req, res) => {
// //   const { messages } = req.body;

// //   try {
// //     const response = await fetchChatGPTResponse(messages);
// //     console.log('message:', response)
// //     res.json({ response });
// //   } catch (error) {
// //     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
// //     res.status(500).json({ error: errorMessage });
// //   }
// // });


// // app.get('/api/nutrition', async (req, res) => {
//   //   const foodQuery = req.query.food as string;
//   //   if (!foodQuery) {
//     //     return res.status(400).json({ error: 'Food query parameter is required' });
//     //   }
    
//     //   const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(foodQuery)}`;
    
//     //   try {
//       //     console.log(`Fetching from search URL: ${searchUrl}`);
//       //     // First fetch: Search for foods matching the query
//       //     const response = await fetch(searchUrl);
//       //     if (!response.ok) {
//         //       throw new Error(`Failed to fetch data from search endpoint, status: ${response.status}`);
//         //     }
//         //     const data = await response.json();
//         //     console.log('Search response data:', data);
        
//         //     if (data.foods && data.foods.length > 0) {
//           //       // Extract the first food item from the search results
//           //       const firstFood = data.foods[0];
//           //       const fdcId = firstFood.fdcId;
          
//           //       const detailsUrl = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`;
//           //       console.log(`Fetching from details URL: ${detailsUrl}`);
//           //       // Second fetch: Get detailed information for the specific food item
//           //       const detailsResponse = await fetch(detailsUrl);
//           //       if (!detailsResponse.ok) {
//             //         throw new Error(`Failed to fetch food details from details endpoint, status: ${detailsResponse.status}`);
//             //       }
//             //       const foodDetails = await detailsResponse.json();
//             //       console.log('Food details response data:', foodDetails);
            
//             //       // Respond with the detailed nutritional information
//             //       res.json(foodDetails);
//             //     } else {
//               //       // No food items found
//               //       res.status(404).json({ error: 'No food data found' });
//               //     }
//               //   } catch (error) {
//                 //     // Handle errors
//                 //     console.error('Error fetching data:', error.message);
//                 //     res.status(500).json({ error: 'Error fetching data', details: error.message });
//                 //   }
//                 // });
                





//                 // app.post('/api/Articles/create' , async (req: Request, res: Response) => {
// //   if (!req.user) {
// //     return res.status(401).send({ error: 'User not authenticated' });
// //   }

// //   const Articlescreate = new Articles({
// //     ...req.body,
// //     authorId: req.user._id,
// //     status: 'draft',
// //   });

// //   try {
// //     await Articlescreate.save();
// //     res.status(201).send(Articlescreate);
// //   } catch (e) {
// //     res.status(400).send(e);
// //   }
// // });




// // // Edit an Articles
// // // router.put('/Articless/:id', authenticate, authorize(['writer']), async (req: Request, res: Response) => {
// // app.put('/api/Articless/:id', async (req: Request, res: Response) => {
// //   const updates = Object.keys(req.body);
// //     const allowedUpdates = ['title', 'content'];
// //     const isValidOperation = updates.every(update => allowedUpdates.includes(update));

// //     if (!isValidOperation) {
// //         return res.status(400).send({ error: 'Invalid updates!' });
// //     }

// //     try {
// //         const Articles = await Articles.findOne({ _id: req.params.id, authorId: req.user?._id });
// //         if (!Articles) {
// //             return res.status(404).send();
// //         }

// //         updates.forEach(update => {
// //             if (update === 'status' && Articles.status === 'published') {
// //                 Articles.status = 'pending';
// //             } else {
// //                 (Articles as any)[update] = req.body[update]; // Using type assertion to any to allow dynamic assignment
// //             }
// //         });

// //         await Articles.save();
// //         res.send(Articles);
// //     } catch (e) {
// //         res.status(400).send(e);
// //     }
// // });


// // // Approve an Articles
// // // router.post('/Articless/:id/approve', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
// // app.post('/api/Articless/:id/approve',async (req: Request, res: Response) => {
// //   try {
// //       const Articlesres = await Articles.findById(req.params.id);
// //       if (!Articlesres) {
// //           return res.status(404).send();
// //       }
// //       Articlesres.status = 'published';
// //       Articlesres.publishedAt = new Date();
// //       await Articlesres.save();
// //       res.send(Articlesres);
// //   } catch (e) {
// //       res.status(400).send(e);
// //   }
// // });




// // // Reject an Articles
// // // router.post('/Articless/:id/reject', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
// // app.post('/api/Articless/:id/reject', async(req: Request, res: Response) => {
// //   try {
// //       const Articles = await Articles.findById(req.params.id);
// //       if (!Articles) {
// //           return res.status(404).send();
// //       }
// //       Articles.status = 'draft';
// //       await Articles.save();
// //       res.send(Articles);
// //   } catch (e) {
// //       res.status(400).send(e);
// //   }
// // });
// // app.post('/:ArticlesId/like', async (req: Request, res: Response) => {
// //   try {
// //       const ArticlesId = req.params.ArticlesId;

// //       // Ensure userId is defined
// //       if (!req.user || !req.user._id) {
// //           return res.status(401).json({ error: 'Unauthorized: Missing or invalid user information' });
// //       }
// //       const userId = req.user._id;

// //       // Check if the user has already liked the Articles
// //       const Articles = await Articles.findById(ArticlesId);
// //       if (!Articles) {
// //           return res.status(404).json({ error: 'Article not found' });
// //       }

// //       const existingLike = Articles.likes.find(like => like.user && like.user.toString() === userId.toString());
// //       if (existingLike) {
// //           return res.status(400).json({ error: 'User already liked this Articles' });
// //       }

// //       // Add new like
// //       Articles.likes.push({ user: userId });
// //       Articles.likesCount = (Articles.likesCount ?? 0) + 1; // Increase the likes count

// //       await Articles.save();

// //       res.status(200).json({ message: 'Article liked successfully' });
// //   } catch (error) {
// //       console.error(error);
// //       res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // // Unlike an Articles
// // app.post('/:ArticlesId/unlike', async (req: Request, res: Response) => {
// //   try {
// //       const ArticlesId = req.params.ArticlesId;

// //       // Ensure userId is defined
// //       if (!req.user || !req.user._id) {
// //           return res.status(401).json({ error: 'Unauthorized: Missing or invalid user information' });
// //       }
// //       const userId = req.user._id;

// //       // Find the Articles
// //       const Articles = await Articles.findById(ArticlesId);
// //       if (!Articles) {
// //           return res.status(404).json({ error: 'Article not found' });
// //       }

// //       // Check if the user has already liked the Articles
// //       const existingLikeIndex = Articles.likes.findIndex(like => like.user && like.user.toString() === userId.toString());

// //       if (existingLikeIndex === -1) {
// //           return res.status(400).json({ error: 'User has not liked this Articles' });
// //       }

// //       // Remove the like
// //       Articles.likes.splice(existingLikeIndex, 1);
// //       Articles.likesCount = (Articles.likesCount ?? 1) - 1; // Decrease the likes count safely

// //       await Articles.save();

// //       res.status(200).json({ message: 'Article unliked successfully' });
// //   } catch (error) {
// //       console.error(error);
// //       res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // // GET /api/Articless/:ArticlesId/likes
// // // Get likes count for an Articles
// // app.get('/:ArticlesId/likes', async (req, res) => {
// //     try {
// //         const ArticlesId = req.params.ArticlesId;

// //         // Find the Articles
// //         const Articles = await Articles.findById(ArticlesId);
// //         if (!Articles) {
// //             return res.status(404).json({ error: 'Article not found' });
// //         }

// //         // Return likes count
// //         res.status(200).json({ likesCount: Articles.likes.length });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ error: 'Server error' });
// //     }
// // });


// // saved info
