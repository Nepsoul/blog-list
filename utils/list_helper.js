const dummy = (blogs) => {
  return 1;
};

const totalLikes = (like) => {
  console.log("hi", like);

  return like.reduce((a, b) => a + b.likes, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
