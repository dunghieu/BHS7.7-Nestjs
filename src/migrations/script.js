const commentLength = {
  SHORT: 10,
  MEDIUM: 20,
  LONG: 100,
};

const generateComment = (length) => {
  const comment = [];
  for (let i = 0; i < length; i++) {
    comment.push(String.fromCharCode(Math.floor(Math.random() * 26) + 97));
  }
  return comment.join('');
};

const randomComment = () => {
  const random = Math.floor(Math.random() * 100);
  const getLength =
    random < 33
      ? commentLength.SHORT
      : random < 66
      ? commentLength.MEDIUM
      : commentLength.LONG;
  return generateComment(getLength);
};

const generateRating = () => {
  return Math.floor(Math.random() * 5) + 1;
};

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const generateTotalReviews = () => {
  return Math.floor(Math.random() * 20) + 1;
};

for (let i = 0; i < 5; i++) {
  const getTotalReviews = generateTotalReviews();
  const Reviews = () => {
    const reviews = [];
    for (let i = 0; i < getTotalReviews; i++) {
      reviews.push({
        userId: Math.floor(Math.random() * 10) + 1,
        rating: generateRating(),
        comment: randomComment(),
        createdAt: randomDate(new Date(2019, 0, 1), new Date()),
        email: 'userEmail',
      });
    }
    return reviews;
  };

  const doc = {
    name: `Product ${Math.floor(Math.random() * 100)}`,
    price: Math.floor(Math.random() * 100),
    description: generateComment(commentLength.LONG),
    category: generateComment(commentLength.SHORT),
    userId: '62d133dff7b8b0612355b4a6',
    totalReviews: getTotalReviews,
    reviews: Reviews(),
  };

  db.product.insert(doc);
}
