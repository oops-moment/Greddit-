import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Stats = () => {
  const [membersData, setMembersData] = useState([]);
  const [postGrowthData, setPostGrowthData] = useState([]);
  const [clicksData, setClicksData] = useState([]);
  const navigate=useNavigate();
  
  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const subGredditName = localStorage.getItem("subg name");

    const fetchPostGrowthData = async (subGredditName) => {
      try {
        const response = await fetch(
          `http://localhost:5001/subreddit/postgrowth?subGredditName=${subGredditName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setPostGrowthData(data);
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostGrowthData(subGredditName);
  }, []);
 


   



  useEffect(() => {
     
    const subgrediitname = localStorage.getItem("subg name");
    const fetchClicksData = async (subgrediitname) => {
      // Replace with the subgreddit name
      try {
        const response = await fetch(
          `http://localhost:5001/subgredit-clicks?subgrediitname=${subgrediitname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data)
        setClicksData(data);    
      } catch (error) {
        console.error(error);
      }
    };
    fetchClicksData(subgrediitname);

  }, []);

  useEffect(() => {
    const subgname = localStorage.getItem("subg name");
    const fetchMembersData = async (subgname) => {
      const response = await fetch(
        `http://localhost:5001/subreddit/members?subGredditName=${subgname}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      setMembersData(data);
    };

    fetchMembersData(subgname);
  }, []);

  return (
    <div>
      <h2>Members Growth</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {membersData.map((data, index) => (
            <tr key={index}>
              <td>{data.date}</td>
              <td>{data.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Post Growth</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {postGrowthData.map((data, index) => (
            <tr key={index}>
              <td>{data._id}</td>
              <td>{data.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Visitors Rate</h2>
      <table>   
        <thead>
          <tr>
            <th>Date</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {clicksData.map((data, index) => (
            <tr key={index}>
              <td>{data.date}</td>
              <td>{data.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stats;
