import React, { useState } from "react";
import { BrowserRouter ,Routes, Route } from "react-router-dom";
import "./App.css"
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import RequestPage from "./Components/requestspage";
import CreateSubGreddit from "./Components/new_subgrediit";
import DisplayFollowers from "./Components/followers";
import Profile2 from "./Components/Profile2";
import SubgreddiitPage from "./Components/subgrediitspage";
import CommonComponent from "./Components/common_component";
import DisplayUsers from "./Components/DisplayUsers";
import ViewsavedPost from "./Components/ViewsavedPost"; 
import Viewreports from "./Components/reports";
import DisplayFollowing from "./Components/following";
import Stats from "./Components/stats";
import CommonComponentNOnMODnj from "./Components/common_component_njnm";
import CommonComponentNOnMODjoined from "./Components/common_component_jnm";
function App() {
  const [current_screen, setScreen] = useState("Login");
  
  const which_form = (screename) => {
    setScreen(screename);
  };

  return (
   <>
    <BrowserRouter>
      <div className="App">
      <Routes>
        <Route
            path="/"   
            element={ current_screen === "Login" ? (
                <Login  onFormSwitch={which_form} />
              ) : (
                <Register  onFormSwitch={which_form} />
              )
            }
            
          />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/profile2" element={<Profile2/>} />
          <Route path="/mysubgrediit" element={<CreateSubGreddit/>} />
          <Route path="/joinrequests" element={<RequestPage/>} />
          <Route path="/subgrediitpage" element={<SubgreddiitPage/>} />
          <Route path="/:subredditName" element={<CommonComponent/>} />
          <Route path="/requests/subgrediit" element={<RequestPage/>} />
          <Route path="/users" element={<DisplayUsers/>}/>
          <Route path="/viewsavedposts" element={<ViewsavedPost/>}/>
          <Route path="/viewreports" element={<Viewreports/>}/>
          <Route path="/followers" element={<DisplayFollowers/>}/>
          <Route path="/following" element={<DisplayFollowing/>}/>
          <Route path="/stats" element={<Stats/>}/>
          <Route path="/nonmodnonjopnesubg" element={<CommonComponentNOnMODnj/>}/>
          <Route path="/nonmodjoiopnesubg" element={<CommonComponentNOnMODjoined/>}/>

      </Routes>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;
