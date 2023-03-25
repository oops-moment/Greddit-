const express = require("express");
const mongoose = require("mongoose");
require("./schemas/report.jsx");
require("./schemas/followers.jsx");
require("./schemas/saved_posts.jsx");
require("./schemas/comments.jsx");
require("./schemas/subgreddits_post.jsx");
require("./schemas/acceptedusers.jsx");
require("./schemas/joinrequest.jsx");
require("./schemas/subgclicks.jsx");
require("./schemas/mysubgrediits.jsx");
require("./schemas/userDetails.js"); // it contains the model and schema for the way data will be stored
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "isbibvbsj woenwh082h34jwq@#$%^kdjfnvjvnejrvne";

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("server started");
});

// -----------------------------------------------------------------------------------------------------------------

// CONNECTING TO SERVER
const mongourl =
  "mongodb+srv://prisha:huehue@cluster0.er5xaow.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongourl, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => console.log(e));

// Middleware for verifying token

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ status: "error", message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
    // console.log("authorized access");
  } catch (err) {
    return res.status(401).send({ status: "error", message: "Invalid token" });
  }
};

// -----------------------------------------------------------------------------------------------------------------

// HERE WE ARE CREATING USER BY USING DATA HE ENTERED IN REGISTERATION PAGE
const user = mongoose.model("Registered Users"); // model declared in userDetails.
app.post("/register", async (req, res) => {
  const user_name = req.body.user_name;
  const pass_word = req.body.pass_word;
  const FirstName = req.body.First_name;
  const LastName = req.body.last_name;
  const contact = req.body.Contact;
  const age = req.body.age;
  const email = req.body.Email;

  // added backend validation to check that none of the field is empty
if (!user_name || !pass_word || !FirstName || !LastName || !contact || !age || !email) {
  res.send({ status: "error", message: "All fields are required" });
  return;
}
  const encryptedpwd = await bcrypt.hash(pass_word, 8);
  const existingUser = await user.findOne({ user_name });

  if (existingUser) {
    res.send({ status: "error", message: "Username already exists" });
    return;
  }
  try {
    await user.create({
      user_name,
      pass_word: encryptedpwd,
      FirstName,
      LastName,
      age,
      contact,
      email,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error", message: "Something went wrong" });
  }
});



// -----------------------------------------------------------------------------------------------------------------

// FOR HANDLING POST REQUESTS OF LOGIN TRIAL

app.post("/loginuser", async (req, res) => {
  const { user_name, pass_word } = req.body;
  const ifany = await user.findOne({ user_name }); // finds if the user exists with given username
  if (!ifany) {
    // checks if the user is registered
    res.send({ status: "error", message: "Username not found" });
    return;
  }
  if (await bcrypt.compare(pass_word, ifany.pass_word)) {
    const token = jwt.sign({ user_name }, JWT_SECRET);
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.send({ status: "error", error: "Invalid UserName or Password" });
  return;
});

// ----------------------------------------------------------------------
// Now we need a end point that stores data from login , so we access in profile page

// app.post("/userdetails",async (req, res) => {
//   const { token } = req.body;
//   try {

//     const users = jwt.verify(token, JWT_SECRET);
//     const username = users.user_name;
//     user.findOne({ username }).then((data) => {
//       const { user_name, contact, FirstName,  LastName } = data;
//       res.send({ status: "ok", data: { user_name, contact, FirstName,  LastName } });
//     })
//     .catch((error) => {
//       res.send({ status: "error", data: error });
//     });
//   } catch (error) {
//     res.send({ status: "error", message: "Invalid token" });
//   }
// });

// -------------------------------------------------------------------------- //

const userr = mongoose.model("Registered Users"); // model declared in userDetails.

app.put("/updateuserdetails", async (req, res) => {
  const { tokens, firstName, lastName, contactValue } = req.body;

  try {
    const decoded = jwt.verify(tokens, JWT_SECRET);
    const usernames = decoded.user_name;

    // Update the user information in the database
    userr
      .findOneAndUpdate(
        { user_name: usernames },
        { FirstName: firstName, LastName: lastName, contact: contactValue },
        { new: true }
      )
      .then((updateduser) => {
        if (!updateduser) {
          return res.status(404).json({
            status: "error",
            message: "User not found",
          });
        }

        // Return a response indicating whether the update was successful
        return res.json({
          status: "ok",
          message: "User details updated successfully",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: "error",
          message: "Failed to update user details",
          error: err,
        });
      });
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Token verification failed",
      error: err,
    });
  }
});
// ------------------------------------------------------------------

// api request for mysubgreddit
const MySubGreddit = mongoose.model("mysubgrediitnew"); // model declared in userDetails.
app.post("/mysubgreddits", verifyToken, async (req, res) => {
  
  // backend validation to check that subgreddit name is not empty
  if (!req.body.subGredditName) {
    res.send({ status: "error", message: "subGredditName is required" });
    return;
  }
    // backend validation to check that subgreddit name is unique
  const existingUser = await MySubGreddit.findOne({  subGredditName: req.body.subGredditName });

  if (existingUser) {
    res.send({ status: "error", message: "SUbgredditname already exists" });
    return;
  }

  const subGreddit = new MySubGreddit({
    subGredditName: req.body.subGredditName,
    subGredditDescription: req.body.subGredditDescription,
    subGredditTag: req.body.subGredditTag,
    username: req.body.username,
    postedon: req.body.time,
    bannedWords: req.body.bannedWords,
    members: [req.body.username], // default value for members
    left_member :[]
  });
  subGreddit
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// -----------------------------------------------------------------------------

app.delete("/mysubgreddits/:subGredditId", verifyToken, (req, res) => {
  const subGredditId = req.params.subGredditId;

  // Delete the subGreddit from the database
  MySubGreddit.findByIdAndDelete(subGredditId, (error, deletedSubGreddit) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting subGreddit",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubGreddit deleted successfully",
      deletedSubGreddit: deletedSubGreddit,
    });
  });
});

// --------------------------------------------------------------

const joinreq = mongoose.model("joinrequests"); // model declared in userDetails.
app.post("/joinrequests", verifyToken, async (req, res) => {
  const request_new = new joinreq({
    subGredditName: req.body.subGredditName,
    username: req.body.userName,
  });
  request_new
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// ---------------------------------------------------------------------

app.delete("/joinrequests/:data_id", verifyToken, (req, res) => {
  const dataId = req.params.data_id;
  // Delete the subGreddit from the database
  joinreq.findByIdAndDelete(dataId, (error, deletedrequest) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting Request",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully",
      deletedSubGreddit: deletedrequest,
    });
  });
});

//  ------------------------------------------------

const accepteduserr = mongoose.model("approvedrequests");

app.post("/approvedrequests", verifyToken, async (req, res) => {
  const accepted_user = new accepteduserr({
    username: req.body.username,
    subgredditName: req.body.subgredditName,
    joinDate: new Date(),
  });

  accepted_user
    .save()
    .then((result) => {
      res.status(201).json(result.toObject({ getters: true }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});


// ----------------------------------------------------------
const MySubGredditt = mongoose.model("mysubgrediitnew"); // model declared in userDetails.
const subgreddit_post = mongoose.model("subgreditposts");
app.post("/subgrediits/posts", verifyToken, async (req, res) => {
  //backend validation that the post text can't be empty string
  if (!req.body.posttext) {
    res.send({ status: "error", message: "post text can't be empty" });
    return;
  }

   // check if the post text contains any of the banned words can't use thrpough direct api even
  const subgredditData = await MySubGredditt.findOne({ subGredditName: req.body.subgredditname });
  const bannedWords = subgredditData.bannedWords;
  const containsBannedWords = bannedWords.some(word => req.body.posttext.includes(word));
  if (containsBannedWords) {
    res.send({ status: "error", message: "post text contains banned words" });
    return;
  }

  const new_post = new subgreddit_post({
    post_text: req.body.posttext,
    postedby: req.body.postedby,
    postedon: req.body.time,
    subgrediitname: req.body.subgredditname,
    upvotes: 0,
    downvotes: 0,
    blockedname: req.body.blockedname,
  });
  new_post
    .save()
    .then((result) => {
      res.status(201).json(result.toObject({ getters: true }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// basically this area is handling upvote

app.put("/subgrediits/posts/:post_id", verifyToken, async (req, res) => {
  const postId = req.params.post_id;
  const username = req.body.upvotedby;
  // Now that we have the user, continue with the rest of the code
  subgreddit_post.findById(postId, (error, post) => {
    if (error) {
      return res.status(500).json({ error });
    }
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.upvotedby.includes(username)) {
      return res
        .status(400)
        .json({ error: "User has already upvoted this post" });
    }

    subgreddit_post.findByIdAndUpdate(
      postId,
      { $inc: { upvotes: 1 }, $push: { upvotedby: username } },
      { new: true },
      (error, updatedPost) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error });
        }
        return res
          .status(200)
          .json({ message: "Upvote added successfully", updatedPost });
      }
    );
  });
});

// this area is handling downvote

app.put("/subgrediits/posts/dv/:post_id", verifyToken, async (req, res) => {
  const postId = req.params.post_id;
  const username = req.body.downvotedby;
  // Now that we have the user, continue with the rest of the code
  subgreddit_post.findById(postId, (error, post) => {
    if (error) {
      return res.status(500).json({ error });
    }
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.downvotedby.includes(username)) {
      return res
        .status(400)
        .json({ error: "User has already upvoted this post" });
    }

    subgreddit_post.findByIdAndUpdate(
      postId,
      { $inc: { downvotes: 1 }, $push: { downvotedby: username } },
      { new: true },
      (error, updatedPost) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error });
        }
        return res
          .status(200)
          .json({ message: "Downvote added successfully", updatedPost });
      }
    );
  });
});

const Comments = mongoose.model("Comments");
app.post("/subgrediits/comments", verifyToken, async (req, res) => {
  const new_comment = new Comments({
    postId: req.body.postId,
    comment: req.body.comment,
    commentedby: req.body.commentedby,
  });
  const comment = req.body.comment;
  if (!comment) {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }
  new_comment
    .save()
    .then((result) => {
      res.status(201).json(result.toObject({ getters: true }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

const saved_possts = mongoose.model("savedposts");
app.post("/subgrediits/savedposts", verifyToken, async (req, res) => {
  try {
    const existingSavedPost = await saved_possts.findOne({
      postId: req.body.postId,
      savedby: req.body.savedby,
    });
    if (existingSavedPost) {
      return res.status(409).json({ message: "Post already saved" });
    }
    const save_post = new saved_possts({
      postId: req.body.postId,
      savedby: req.body.savedby,
    });
    const result = await save_post.save();
    res.status(201).json(result.toObject({ getters: true }));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});



const follower = mongoose.model("followers");
app.post("/followers", verifyToken, async (req, res) => {
  const existingUser = await follower.findOne({ username: req.body.user,followedby: req.body.followedby});

  if (existingUser) {
    res.send({ status: "error", message: "exists" });
    return;
  }
  const { user, followedby } = req.body;
  
  try {
    const follower_new = new follower({
      username: user,
      followedby: followedby,
    });
    const result = await follower_new.save();
    res.status(201).json(result.toObject({ getters: true }));
  } catch (error) { 
      res.status(500).json({ error });
  }
});

// ---------------------------------------------------------------
// delete the post from saved posts

const saved_post = mongoose.model("savedposts");
app.delete("/savedposts/:savedpostId", verifyToken, (req, res) => {
  const savedpostId = req.params.savedpostId;
  // Delete the subGreddit from the database
  saved_post.findByIdAndDelete(savedpostId, (error, deletedrequest) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting Request",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Saved post removed Successfully",
      deletedSubGreddit: deletedrequest,
    });
  });
});

// here we are gonna store the reports made so far
const Reportss = mongoose.model("reports");
app.delete("/reports/:reportId", verifyToken, (req, res) => {
  const reportId = req.params.reportId;
  // Delete the subGreddit from the database
  Reportss.findByIdAndDelete(reportId, (error, deletedrequest) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting Report",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted",
      deletedSubGreddit: deletedrequest,
    });
  });
});

const Reports = mongoose.model("reports");
app.post("/subgrediits/reports", verifyToken, async (req, res) => {
  const new_report = new Reports({
    reportedby: req.body.reportedby,
    userreported: req.body.userreported,
    concern: req.body.concern,
    textreported: req.body.textreported,
    subgredditname: req.body.subgredditname,
    postid: req.body.postid,
    date: new Date(), // Set the date field to the current date and time
  });
  new_report
    .save()
    .then((result) => {
      res.status(201).json(result.toObject({ getters: true }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});



const nodemailer = require('nodemailer');

// create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'prish1412a@gmail.com',
    pass: 'erkcylijifwohpzl',
  },
});

app.put("/subgrediits/reports/:id", verifyToken, async (req, res) => {
  const Reports = mongoose.model("reports");
  const emailto = req.body.emailto;
  const emailtowhor = req.body.emailtowhor;
  console.log(emailto);
  console.log(emailtowhor);
  
  try {
    const report = await Reports.findByIdAndUpdate(
      req.params.id,
      { isBlocked: req.body.isBlocked,date:req.body.date},
      { new: true }
    );

    // Send email to emailto
    const mailOptions = {
      from: "prish1412a@gmail.com",
      to: emailto,
      subject: "Report blocked",
      text: `The report with id ${req.params.id} has been blocked as it was against the community guidelines`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Send email to emailtowhor
    const mailOptions2 = {
      from: "prish1412a@gmail.com",
      to: emailtowhor,
      subject: "Report Status",
      text: `Your report has been handled well , and appropriate action is being taken, thanks `,
    };

    transporter.sendMail(mailOptions2, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json(report);
  } catch (error) {
    console.error("Error blocking report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// app.put("/subgrediits/reports/:id", verifyToken, async (req, res) => {
//   const Reports = mongoose.model("reports");
//   const email=req.body.emailto;
//   const emailtowhor=req.body.emailtowhor;
//   console.log(email);
//   try {
//     const report = await Reports.findByIdAndUpdate(
//       req.params.id,
//       { isBlocked: req.body.isBlocked },
//       { new: true }
//     );

//     // Send email
//     const mailOptions = {
//       from: "prish1412a@gmail.com",
//       to: email,
//       subject: "Report blocked",
//       text: `The report with id ${req.params.id} has been blocked as it was against the community guidelines`,
//     };

//     // send email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

//     res.json(report);
//   } catch (error) {
//     console.error("Error blocking report:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });




app.put("/subgrediits/postsblock", verifyToken, async (req, res) => {
  const subgreddit_post = mongoose.model("subgreditposts");
  try {
    const report = await subgreddit_post.findByIdAndUpdate(
      req.query.postid,
      { blockedname: "blockeduser" },
      { new: true }
    );
    res.json(report);
  } catch (error) {
    console.error("Error blocking report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const followerr = mongoose.model("followers");
app.delete("/followers/:followerid", verifyToken, (req, res) => {
  const follwerId = req.params.followerid;
  // Delete the subGreddit from the database
  followerr.findByIdAndDelete(follwerId, (error, deletedrequest) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error removing follower",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "follower removed",
      deletedSubGreddit: deletedrequest,
    });
  });
});

const following = mongoose.model("followers");
app.delete("/following/:followingId", verifyToken, (req, res) => {
  const follwingId = req.params.followingId;
  // Delete the subGreddit from the database
  following.findByIdAndDelete(follwingId, (error, deletedrequest) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error removing follower",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "unfollowed",
      deletedSubGreddit: deletedrequest,
    });
  });
});


app.put("/mysubgreddits_count", verifyToken, async (req, res) => {
  const MySubGreddit = mongoose.model("mysubgrediitnew"); // model declared in userDetails.
  const subGredditName = req.query.subgname;

  try {
    // Find the subreddit by its name
    const subGreddit = await MySubGreddit.findOne({
      subGredditName: subGredditName,
    });

    if (!subGreddit) {
      return res.status(404).json({ error: "Subreddit not found" });
    }

    // Increment the total_posts field by 1
    subGreddit.total_posts += 1;

    // Save the updated subreddit object
    const result = await subGreddit.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});


const subgreddit_posts = mongoose.model("subgreditposts");

app.delete("/mypostsdelete/:postId", verifyToken, (req, res) => {
  const postId = req.params.postId;

  subgreddit_posts.findByIdAndDelete(postId, (error, deletedrequest) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "error deleting",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "deleted",
      deletedSubGreddit: deletedrequest,
    });
  });
});

const subgreditClicks = mongoose.model("subgreditClicks");
app.post("/subreddit/click", verifyToken, async (req, res) => {
  const { subgname } = req.body;
  const today = new Date().setHours(0, 0, 0, 0);

  try {
    let subgreditClick = await subgreditClicks.findOne({
      subgrediitname: subgname,
      date: today,
    });

    if (subgreditClick) {
      subgreditClick.clicks++;
      await subgreditClick.save();
    } else {
      subgreditClick = new subgreditClicks({
        subgrediitname: subgname,
        date: today,
        clicks: 1,
      });
      await subgreditClick.save();
    }

    res.status(200).send("Click recorded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

const todeluserr = mongoose.model("approvedrequests");

app.delete("/approvedrequestsdel", verifyToken, async (req, res) => {
  const username=req.body.username;
  const subgreditname=req.body.subgredditName;
  try {
    const deletedUser = await todeluserr.findOneAndDelete({username: username,  subgredditName :subgreditname});
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


const subgredupdate=mongoose.model("mysubgrediitnew"); // model declared in userDetails.

app.put("/subgreddits/members", verifyToken, async (req, res) => {
  const { subgredditName, username } = req.body;

  try {
    const updatedSubgreddit = await subgredupdate.findOneAndUpdate(
      { subGredditName: subgredditName },
      { $push: { members: username } },
      { new: true }
    );

    if (!updatedSubgreddit) {
      return res.status(404).json({ message: "Subgreddit not found" });
    }

    res.json(updatedSubgreddit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const subgredupdated = mongoose.model("mysubgrediitnew");
app.put("/subgreddits/memberslef", verifyToken, async (req, res) => {
  const { username, subgredditName } = req.body;
  try {
    const updatedSubgreddit = await subgredupdated.findOneAndUpdate(
      { subGredditName: subgredditName },
      {
        $pull: { members: username },
        $push: { left_member: username }
      },
      { new: true }
    );

    if (!updatedSubgreddit) {
      return res.status(404).json({ message: "Subgreddit not found" });
    }

    res.json(updatedSubgreddit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



const reports = mongoose.model("reports");

app.delete("/reportdelete/:reportid", verifyToken, (req, res) => {
  const reportid = req.params.reportid;

 reports.findByIdAndDelete( reportid, (error, deletedrequest) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "error deleting",
        error: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "deleted",
      deletedSubGreddit: deletedrequest,
    });
  });
});