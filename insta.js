require('dotenv').config();

const express = require('express');

const cors = require('cors');

const app = express();

const mongoose = require('mongoose');

app.use(express.json());

app.use(cors())


const postSchema  = new mongoose.Schema({
    image:String,
    caption:String,
    comments:{
        type:[String],
        default:[]
    },
    likes:{
        type:Number,
        default :0
    }
})


const Post = mongoose.model('InstaPost',postSchema)


app.get('/posts',async(req,res)=>{
    const posts = await Post.find({});
    res.send(posts)
})


app.get('/posts/:id',async(req,res)=>{
    const id = req.params.id
    const post = await Post.findById(id)
    res.send(post)

})


app.post('/posts', async (req ,res)=> {
    const image = req.body.image
    const caption= req.body.caption;

    const post = new Post({
        image,
        caption
    })
    await post.save()
    res.send(post)
})


app.put('/posts/:id' , async (req ,res )=> {
    const id = req.params.id
    const caption = req.body.caption
    
    const post = await Post.findById(id)
    
    post.caption = caption
    
    await post.save()
    return res.send(post)
})


app.delete('/posts/:id',async(req,res)=>{
    const id = req.params.id

    await Post.findByIdAndDelete(id)

    res.send('Post Deleted Successfully')
})


app.put('/posts/:id/like',async(req,res)=>{
    const id = req.params.id

    const post = await Post.findById(id)

    post.likes = post.likes + 1
    
    await post.save()
    res.send(post)
})


app.put('/posts/:id/unlike',async(req,res)=>{
    const id = req.params.id

    const post = await Post.findById(id)

    post.likes = post.likes - 1
    
    await post.save()
    res.send(post)
})


app.put('/posts/:id/comment',async(req,res)=>{
    const id = req.params.id
    const comment = req.body.comment

    const post = await Post.findById(id)

    post.comments.push(comment)
    await   post.save()
    return    res.send(post)
})


app.get('/posts/:id/comments',async(req,res)=>{
    const id = req.params.id
    const post = await Post.findById(id)
    return res.send(post.comments)
})


app.get('/posts/:id/likes',async(req,res)=>{
    const id = req.params.id
    const post = await Post.findById(id)
    return res.send(post.likes)
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Connected to the database!");
    })
});