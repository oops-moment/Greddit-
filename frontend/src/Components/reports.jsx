import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./reports.css"; // including report.css
import { useEffect } from "react";
const Viewreports = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const [ignoreReport, setIgnoreReport] = useState(null); // state variable to keep track of ignored reports
  const subgname = localStorage.getItem("subg name");
  const [isBlocking, setIsBlocking] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [idd, setid] = useState(null);
  const [postidd, setpostid] = useState(null);
  const [blockingReportId, setBlockingReportId] = useState(null);
  const [userreported, setuserreported] = useState(null);
  const [email, setemail] = useState("prisha.dcmc@gmail.com");
  const [whoremail,setwhoremail]=useState("");

  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  const handleDelete = async (reportId) => {
    
    try {
      await fetch(`http://localhost:5000/reports/${reportId}`, {
        method: "DELETE",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Report deleted");
    } catch (error) {
      console.error("Error:", error);
    }

    // Fetch the updated reports data and set it in the state

    const subgname= localStorage.getItem("subg name");
    const fetchData = async (subgname) => {
      try {
        const response = await fetch(
          `http://localhost:5001/reportret?subgname=${subgname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchData(subgname);
  };

  useEffect(() => {
    let timer;
    if (isBlocking && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isBlocking && countdown === 0) {
      // block the user here
      HandleBlock();
      console.log("Blocked user!");
      setIsBlocking(false);
      setCountdown(3);
    }
    const button = document.getElementById("block-button");
    if (button) {
      if (countdown > 0) {
        button.innerText = `Block User (${countdown})`;
      } else {
        button.innerText = "User Blocked";
      }
    }
    return () => clearTimeout(timer);
  }, [isBlocking, countdown]);

  const handleBlockClick = (id, postid, name,whoreported) => {
    setuserreported(name);
    
    const fetchData = async (userreported) => {
      try {
        const response = await fetch(
          `http://localhost:5001/userdetails?username=${userreported}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        const email = data[0].email;
        setemail(email);
        console.log(email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchData(userreported);
     
    const fetchhData = async (whoreported) => {
      try {
        const response = await fetch(
          `http://localhost:5001/userdetails?username=${whoreported}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        const email = data[0].email;
        setwhoremail(email);
        console.log(email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchhData(whoreported);

    setIsBlocking(true);
    setid(id);
    setBlockingReportId(id);
    setpostid(postid);
  };

  const handleCancelClick = () => {
    setIsBlocking(false);
    setCountdown(3);
  };

  const HandleBlock = async () => {
    console.log("function called");
    console.log("hi" + email);
    const id = idd;
    const postid = postidd;
    console.log(email);
    try {
      const response1 = await fetch(
        `http://localhost:5000/subgrediits/reports/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify({ isBlocked: true, emailto: email,emailtowhor: whoremail,date: new Date() }),
        }
      );
      const data1 = await response1.json();
      setReport((prevReport) =>
        prevReport.map((r) => (r._id === id ? { ...r, isBlocked: true } : r))
      );
    } catch (error) {
      console.error("Error blocking report:", error);
    }

    try {
      const response2 = await fetch(
        `http://localhost:5000/subgrediits/postsblock?postid=${postid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            blockedname: "blockeduser",
          }),
        }
      );

      // Handle response if needed
    } catch (error) {
      console.error("Error during request:", error);
      // Handle error if needed
    }
  };

  const fetchData = async (subgname) => {
    try {
      const response = await fetch(
        `http://localhost:5001/reportret?subgname=${subgname}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      const currentDate = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(currentDate.getDate() - 10);

      for (const report of data) {
          const reportDate = new Date(report.date);
      if (reportDate < tenDaysAgo) {
        await handleDelete(report._id);
        data = data.filter((r) => r._id !== report._id);
      }
    }

      setReport(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchData(subgname);
  }, [subgname]);

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => navigate("/subgrediitpage")}>
          Sub Greddiit Page
        </button>
        <button onClick={() => navigate("/mysubgrediit")}>
          My Sub Greddiits Page
        </button>
        <button onClick={() => navigate("/profile2")}>Profile</button>
      </nav>

      <table className="create-subgreddit-table">
        <thead>
          <tr>
            <th>Reported By</th>
            <th>Person Reported</th>
            <th>Subgreddit Heading</th>
            <th>Concern</th>
            <th>Offensive Text</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {report &&
            report.length > 0 &&
            report.map((r) => (
              <tr key={r._id}>
                <td>{r.reportedby}</td>
                <td>{r.userreported}</td>
                <td>{r.subgredditname}</td>
                <td>{r.concern}</td>
                <td>{r.textreported}</td>
                <td>
                  <button
                    disabled={ignoreReport === r._id}
                    onClick={() => handleDelete(r._id)}
                    style={{ opacity: ignoreReport === r._id ? 0.25 : 1 }}
                  >
                    DELETE
                  </button>

                  {!isBlocking && (
                    <button
                      onClick={() =>
                        handleBlockClick(r._id, r.postid, r.userreported,r.reportedby)
                      }
                      style={{ opacity: ignoreReport === r._id ? 0.25 : 1 }}
                    >
                      Block
                    </button>
                  )}
                  {isBlocking && blockingReportId !== r._id && (
                    <button
                      onClick={() =>
                        handleBlockClick(r._id, r.postid, r.userreported,r.reportedby)
                      }
                      style={{ opacity: ignoreReport === r._id ? 0.25 : 1 }}
                    >
                      Block
                    </button>
                  )}
                  {isBlocking && blockingReportId === r._id && (
                    <button>
                      Cancel in {countdown} sec{countdown > 1 ? "s" : ""}
                    </button>
                  )}
                  {isBlocking && blockingReportId === r._id && (
                    <button onClick={() => handleCancelClick()}>Cancel</button>
                  )}

                  <button onClick={() => setIgnoreReport(r._id)}>IGNORE</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Viewreports;
