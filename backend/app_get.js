const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { post } = require("jquery");
require("./schemas/followers.jsx")
require("./schemas/report.jsx")
require("./schemas/subgclicks.jsx")
require("./schemas/saved_posts.jsx")
require("./schemas/mysubgrediits.jsx")
require("./schemas/joinrequest.jsx")
require("./schemas/acceptedusers.jsx")
require("./schemas/subgreddits_post.jsx")
require("./schemas/userDetails.js")
require("./schemas/comments.jsx")
const jwt = require("jsonwebtoken");
const JWT_SECRET="isbibvbsj woenwh082h34jwq@#$%^kdjfnvjvnejrvne"

app.use(cors());
app.use(express.json());

app.listen(5001, () => {
  console.log("Server started on port 5001");
});

const mongourl =
  "mongodb+srv://prisha:huehue@cluster0.er5xaow.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((e) => console.log(e));
  
  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ status: 'error', message: 'Unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
      // console.log("authorized access")
    } catch (err) {
      return res.status(401).send({ status: 'error', message: 'Invalid token' });
    }
  };
  


  app.get("/mysubgredditsret", verifyToken,(req, res) => {
    const myysubgreddits = mongoose.model("mysubgrediitnew");
    const username = req.query.username;
    let filter = {};
    if (username) {
      filter.username = username;
    }
    myysubgreddits.find(filter)
      .then((MYYsubgreddits) => {
        res.send(MYYsubgreddits);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error fetching data from the database");
      });
  });
  
//  --------------------------------------------------

app.get("/joinreqret",verifyToken, (req, res) => {
  const new_request = mongoose.model("joinrequests");
  const subgredditname = req.query.subgredditname;
  // console.log(subgredditname)
  let filter = {};
  if (subgredditname) {
    filter.subGredditName = subgredditname;
  }

  new_request.find(filter)
    .then((new_request) => {
      res.send(new_request);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});


app.get("/approvedrequestsret",verifyToken, (req, res) => {
  const accepteduserr= mongoose.model("approvedrequests"); // model declared in userDetails.
  const subgredditname = req.query.subgredditname;

  let filter = {};
  if (subgredditname) {
    filter.subgredditName = subgredditname;
  }

  accepteduserr.find(filter)
    .then((new_request) => {
      res.send(new_request);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});


// here we will retreive the subgredditspost 

app.get("/subgrediitpostsret",verifyToken, (req, res) => {
  const subgreddit_post = mongoose.model("subgreditposts");
  const subgredditname = req.query.subgredditname;

  let filter = {};
  if (subgredditname) {
    filter.subgrediitname = subgredditname;
  }

  subgreddit_post
    .find(filter)
    .then((new_request) => {
      res.send(new_request);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});


// here we will retreive the saved posts 

// app.get("/savedpostsret",verifyToken, (req, res) => {
//   const saved_post = mongoose.model("savedposts");
//   const username = req.query.username;
 
//   let filter = {};
//   if (username) {
//     filter.savedby = username;
//   }

//   saved_post.find(filter)
//     .then((saved_post) => {
//       res.send(saved_post);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send("Error fetching data from the database");
//     });
// });
const saved_post = mongoose.model("savedposts");

app.get("/savedpostsret", verifyToken, (req, res) => {
  const username = req.query.username;

  let filter = {};
  if (username) {
    filter.savedby = username;
  }

  saved_post.find(filter)
    .populate('postId') // Populate the postId field with corresponding subgreditpost document
    .then((saved_posts) => {
      res.send(saved_posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});


// here we will retreive the filtered posts

app.get("/subgredditsret",verifyToken, (req, res) => {
  const mysubgreddits = mongoose.model("mysubgrediitnew");
  const tags = req.query.tags; // Assuming tags are passed as a comma-separated string
  console.log(tags)
  let filter = {};
  if (tags) {
    const tagsArray = tags.split(",");
    filter.subGredditTag = { $all: tagsArray };
  }
  mysubgreddits
    .find(filter)
    .then((MYYsubgreddits) => {
      res.send(MYYsubgreddits);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});


// ----------------------------------------------------------------



app.get("/reportret",verifyToken, (req, res) => {
  const myreports = mongoose.model("reports");
  const subgname = req.query.subgname; // Assuming tags are passed as a comma-separated string
  let filter = {};
  if (subgname) {
   
    filter.subgredditname = subgname ;
  }
  myreports
    .find(filter)
    .then((reports) => {
      res.send(reports);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});

//---------------------------------------------retreiving the subgreddit based upon the name ek hi hoga


app.get("/subgredditsretname",verifyToken, (req, res) => {
  const mysubgreddits = mongoose.model("mysubgrediitnew");
  const subgname = req.query.subggname; // Assuming tags are passed as a comma-separated string
  // console.log(tags)
  let filter = {};
  if (subgname) {
   
    filter.subGredditName = subgname;
  }
  mysubgreddits
    .find(filter)
    .then((MYYsubgreddits) => {
      res.send(MYYsubgreddits);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});


app.get("/userdetails",verifyToken, (req, res) => {
  const username=req.query.username;
  const User = mongoose.model("Registered Users"); // model declared in userDetails.  const tags = req.query.tags; // Assuming tags are passed as a comma-separated string
  let filter = {};
  if (username) {
   
    filter.user_name = username;
  }
  User
    .find(filter)
    .then((details) => {
  
      res.send(details);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});



app.get("/followersret", verifyToken,(req, res) => {
  const username=req.query.username;
  const follower = mongoose.model("followers"); // model declared in userDetails.  const tags = req.query.tags; // Assuming tags are passed as a comma-separated string
  let filter = {};
  if (username) {
   
    filter.username = username;
  }
  follower
    .find(filter)
    .then((details) => {
  
      res.send(details);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});

app.get("/followingret",verifyToken, (req, res) => {
  const followedby=req.query.followedby;
  const follower = mongoose.model("followers"); // model declared in userDetails.  const tags = req.query.tags; // Assuming tags are passed as a comma-separated string
  let filter = {};
  if (followedby) {
   
    filter.followedby = followedby;
  }
  follower
    .find(filter)
    .then((details) => {
  
      res.send(details);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});

app.get("/blockedusers",verifyToken, async (req, res) => {
  const approvedRequests = mongoose.model("approvedrequests");
  const subgreditPosts = mongoose.model("subgreditposts");

  const subgredditName = req.query.subgredditname;
  const username = req.query.username;

  try {
    const approvedRequest = await approvedRequests.findOne({ 
      subgredditName: subgredditName,
      username: username
    });

    const blockedUsers = await subgreditPosts.find({
      subgreditname: subgredditName,
      blockedname: "blockeduser",
      postedby: approvedRequest.username
    });

    res.json(blockedUsers);
  } catch (error) {
    console.error("Error fetching blocked users", error);
    res.status(500).send("Error fetching data from the database");
  }
});



const accepteduserr = mongoose.model("approvedrequests");
app.get("/subreddit/members",verifyToken, async (req, res) => {
  const subGredditName = req.query.subGredditName;
  try {
    const result = await accepteduserr.aggregate([
      {
        $match: { subgredditName: subGredditName }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$joinDate" } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// here i need to get 
const subgreditpostsModel = mongoose.model('subgreditposts');

// Get post growth data for a subreddit
app.get('/subreddit/postgrowth',verifyToken,async (req, res) => {
  try {
    const subGredditName = req.query.subGredditName;
    const postGrowthData = await subgreditpostsModel.aggregate([
      {
        $match: {
          subgrediitname: subGredditName
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$postedon"
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);

    res.json(postGrowthData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// to fetch the number of clciks
const subgreditClicks = mongoose.model('subgreditClicks');

app.get('/subgredit-clicks',verifyToken, async (req, res) => {
  const subgrediitname = req.query.subgrediitname;
  const data = await subgreditClicks.find({ subgrediitname });
  res.send(data);
});

const comment = mongoose.model("Comments");
app.get("/viewcomments",verifyToken, (req, res) => {
  const postId=req.query.postId;
   // model declared in userDetails.  const tags = req.query.tags; // Assuming tags are passed as a comma-separated string
  let filter = {};
  if (postId) {  
    filter.postId = postId;
  }
  comment
    .find(filter)
    .then((details) => {
      res.send(details);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});


const reports = mongoose.model("reports");
app.get("/reportsret/:postId", verifyToken, (req, res) => {
  const postId = req.params.postId;
  let filter = {};
  if (postId) {  
    filter.postid = postId;
  }
  reports
    .find(filter)
    .then((details) => {
      res.send(details);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data from the database");
    });
});

