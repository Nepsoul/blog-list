const dummy = (blogs) => {
  return 1;
};

const totalLikes = (like) => {
  // console.log("hi", like);
  return like.reduce((a, b) => a + b.likes, 0);
};

const favoriteBlog = (mostLike) => {
  let topLikes = 0;
  let topBlog = {};
  for (let i = 0; i < mostLike.length; i++) {
    if (mostLike[i].likes > topLikes) {
      topLikes = mostLike[i].likes;
      topBlog = mostLike[i];
    }
  }
  return topBlog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
