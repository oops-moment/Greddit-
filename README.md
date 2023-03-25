# MERN Assignment - Prisha

## Description

 The project consists of a web application that uses the MERN stack (MongoDB, Express.js, React.js, and Node.js) to allow users to perform various tasks.

## Directory Structure

- Run sudo docker-compose up --build to start the server 

The repository has the following directory structure:

- `backend/`: Contains the code for the backend server.
  - `package.json`: Contains the dependencies required for the backend server.
  - Other backend files.
- `frontend/`: Contains the code for the frontend.
  - `package.json`: Contains the dependencies required for the frontend.
  - Other frontend files.
- `nginx/`: Contains the main configuration file.
  - `local.conf`: Contains the dependencies required for the frontend.
  - Other frontend files.
- `docker-compose.yml` :YAML file that defines a multi-container Docker application.
- `README.md`: This file.
<br/>
<br/>
## Assumptions

- The user has Node.js and npm installed on their system.
- The user has MongoDB installed and running on their system.
## App.js

This file contains the main component of the MERN application, which renders the different components based on the current route. The component uses React Router to handle the routing functionality.


- `Login`: Renders the login form.
- `Register`: Renders the registration form.
- `Profile`: Renders the user profile.
- `RequestPage`: Renders the join requests page.
- `CreateSubGreddit`: Renders the form to create a new subgrediit.
- `DisplayFollowers`: Renders the followers page.
- `Profile2`: Renders an alternate version of the user profile.
- `SubgreddiitPage`: Renders the subgrediit page.
- `CommonComponent`: Renders the common component used in subgrediits ie displaying and adding post .
- `DisplayUsers`: Renders the list of users.
- `ViewsavedPost`: Renders the page to view saved posts.
- `Viewreports`: Renders the reports page.
- `DisplayFollowing`: Renders the following page.
- `Stats`: Renders the statistics page.
- `CommonComponentNOnMODnj`: Renders a  version of the common component used by non moderator and non joined user.
- `CommonComponentNOnMODjoined`:   Renders a  version of the common component used by non moderator and  joined user

### Libraries/Frameworks Used

- React
- React Router

---
## Components: Each component is located in the `components/` directory and can be accessed from there.


### <ul> **Profile2**</ul>

The component fetches user details, followers, and following data from a backend server using the fetch function and the useEffect hook. It also allows users to update their profile data, and provides navigation links to other pages. The component is also responsible for displaying user profile data using MongoDB, and handles logging out and editing the user's profile.

Assumptions:

- In Edit profile the form can be submitted only when atleast one field is non empty else button is disabled.

- NOTE : if in the edit profile you leave some field empty then then will be set empty , if you want it to remain unchanged , enter previous value.

- Changes of edit are reflected in the bio under the username , as first name and last name , rest can be verified from backend data.

---

### <ul> **Sub Greddit Page**</ul>

This page contains list all subgreddit irrespective they were created by loggedin user or not. Each subgreddit has open option along with join and leave option. Basic detail of each subgreddit is displayed such as number of post and people joined .Clicking on open redirects user to page of that particular subgreddit. Apart from it there is search bar implemented **along with feature for fuzzy search**.

Assumptions:

- FIlter subgreddit provides user with five options to select tag from tag1,tag2,tag3,tag4,tag5. Multiple tags can be selected at once , tags can be reset by deselecting manually or simply refresh page.

- Every user irrespective joined or not is able to open subgreddit with difference that joined user has options to upvote, savepost, downvote and muchh more but non joined can only see posts.

- joined and remaining subgreddits are distinguished with the effect that joined is displayed in all the subgreddit , in remaining there is join instead , not written explicitly those 

- Search bar have live fuzzy approach to reset search simply erase the text you searched for .

- User once left can't join again !

--- 

### <ul> **My Sub Greddit Page**</ul>

This page contains all only the subgreddit created by logged in user . MOderator is able to
view option to view stats, users, reports , requests.

Assumptions:

- Subgreddit needs to have unique name and can't be left empty.
- Tags has to only from tag1,tag2,tag3,tag4,tag5.
- So, there is backend and front end validation for subgreddit creation where name is unique and can't be empty.

### <ul> **Particular Sub Greddit Page**</ul>
This page displays all the posts in subgreddit that have been psoted till now.Non joined user would be able to view this page but wont be able to post or react.However , the joined user can add posts , react to the post and save them.

Assumptions:

- User can't follow blocked user .
- User cant follow himself.
- Comment field can't be empty this is handled in frontend and backend as the button is disabled.
- User can upvote/downvote only once.


### <ul> **Reported Page**</ul>
This page displays all the reports that have been made on the subgreddit so far, each report has three actions: Ignore , Block, Delete. Ignore fades out the other options.
Block changes the name of the user to blocked and email is sent for **action taken through nodemailer**

Assumptions:

- Ignore option fades the other two option for particular session.
- Blocked request still remain in subgreddit ,like the report isn't deleted


### <ul> **Request Page**</ul>
This page displays all the requests that have been made to join subgreddit so far !!.
User has two option either to accept / reject. Accepting add user to the list ofuser for that subgreddit where as reject deletes the request.

- If multiple requests are made , then user its' shown only one time.



### <ul> **Users Page**</ul>
This page displays all the users who have joined subgreddit so far , they are seperated into blocked users and non blocked users


### <ul> **Stats Page**</ul>
This page displays stats of page such as members joined over time displayed in tabulated format , along with visitor rate and posts etc in tabulated format .


