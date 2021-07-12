const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      img: {
        type: String,
        default: '/uploads/images/defult_logo.png',
      },
    caption: {
        type: String,
        required: true,
      },
    location: String,
    city: {
        type: String,
        required: true,
      },
    rate: String,
    date: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  desription:{type:String,
    require:true},
   
},

{
    timestamps: true // means createdAt and updatedAt  
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
    
    