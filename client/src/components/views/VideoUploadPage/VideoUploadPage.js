import React, { useState } from "react";
import Dropzone from "react-dropzone";

const Private = {};

function VideoUploadPage() {
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");

  return (
    <div className="con01" style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>Upload Video</h1>
      </div>

      <form className="formZone" onSubmit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Dropzone onDrop multiple maxSize>
              {({ getRootProps, getInputProps }) => (
                <div
                  style={{
                    width: "300px",
                    height: "240px",
                    border: "1px solid grey",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <duv style={{ fontSize: "4rem" }}>+</duv>
                </div>
              )}
            </Dropzone>
            <img></img>
          </div>
        </div>
        <br />
        <br />
        <label className="title">Title</label>
        <input onChange value={VideoTitle}></input>
        <br />
        <br />
        <label>Description</label>
        <textarea onChange value={Description}></textarea>
        <br />
        <br />
        <select onChange>
          <option value>Private</option>
          <option value>Public</option>
        </select>
        <br />
        <br />
        <select onChange>
          <option value></option>
        </select>
        <br />
        <br />

        <button type="primary" onClick>
          onSubmit
        </button>
      </form>
    </div>
  );
}

export default VideoUploadPage;
