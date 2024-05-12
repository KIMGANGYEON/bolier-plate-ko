import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";
import { withRouter } from "react-router-dom";

function LandingPage() {
  // const navigate = useNavigate();

  // const onClickHandler = () => {
  //   axios.get("/api/users/logout").then((response) => {
  //     if (response.data.logoutSuccess) {
  //       navigate("/login");
  //     } else {
  //       alert("로그아웃 실패bo");
  //     }
  //   });
  // };

  // useEffect(() => {
  //   axios.get("/api/hello").then((response) => console.log(response));
  // }, []);

  const [Video, setVideo] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        // console.log(response.data.videos);
        setVideo(response.data.videos);
      } else {
        alert("비디오 가져오기를 실패");
      }
    });
  });

  return (
    <div className="LandingPage">
      {Video.map((video, index) => (
        <div>
          <h1 key={index}>{video.title}</h1>
          <span key={index}>{Math.round(video.duration)}</span>
        </div>
      ))}
    </div>
  );
}

export default LandingPage;
