const dummy = (blogs) => {
  return 1;
};

const totalLikes = (like) => {
  // console.log("hi", like);
  return like.reduce((a, b) => a + b.likes, 0);
};

const favoriteBlog = (mostLike) => {
  console.log("highlike", mostLike);
  let highlike = mostLike.reduce((preVal, curVal) => {
    if (mostLike.length === 1) {
      console.log(mostLike.length);
      preVal = {
        title: curVal.title,
        author: curVal.author,
        likes: curVal.likes,
      };
    }
    if (preVal.likes >= curVal.likes) {
      console.log("else condn", preVal.likes);
      preVal = {
        title: preVal.title,
        author: preVal.author,
        likes: preVal.likes,
      };
    } else {
      preVal = {
        title: curVal.title,
        author: curVal.author,
        likes: curVal.likes,
      };
    }

    console.log("val", preVal);
    return preVal;
  }, {});
  return highlike;
};

/*==>alternative<====
const favoriteBlog = (blogs) => {
   let topLikes = 0;
   let topBlog = {};
   for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > topLikes) {
       topLikes = blogs[i].likes;
      topBlog = blogs[i];
    }
   }
  return topBlog;
 };*/

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
