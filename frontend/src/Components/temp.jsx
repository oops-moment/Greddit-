useEffect(() => {
  if (
    localStorage.getItem("loggedin") === "false" ||
    localStorage.getItem("loggedin") === null
  ) {
    navigate("/");
  }
}, []);