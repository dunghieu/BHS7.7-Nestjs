//Top 3 product nhieu reviews nhat
db.getCollection('product').aggregate(
  [
    {
      $sort: {
        totalReviews: -1.0,
      },
    },
    {
      $limit: 3.0,
    },
  ],
  {
    allowDiskUse: false,
  },
);
//Top 3 product nhieu rating nhat
db.getCollection('product').aggregate(
  [
    {
      $unwind: {
        path: '$reviews',
      },
    },
    {
      $project: {
        _id: 1.0,
        reviews: '$reviews.rating',
      },
    },
    {
      $group: {
        _id: '$_id',
        totalReviews: {
          $sum: '$reviews',
        },
      },
    },
    {
      $sort: {
        totalReviews: -1.0,
      },
    },
    {
      $limit: 3.0,
    },
  ],
  {
    allowDiskUse: false,
  },
);
