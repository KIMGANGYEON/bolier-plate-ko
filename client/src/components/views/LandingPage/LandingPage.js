import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    const data = async () => {
      const response = await axios.get("/api/hello");
      console.log(response);
    };
    data();
  }, []);

  return <div>LandinssgssPage</div>;
}

export default LandingPage;
