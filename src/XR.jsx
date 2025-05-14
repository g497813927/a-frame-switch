import React, { useEffect } from 'react';
import 'aframe';
import { Button } from '@mui/material';
import Hls from 'hls.js';
import { Link } from 'react-router-dom';
/* global AFRAME */

// Function to handle scene click
AFRAME.registerComponent("cursor-listener", {
  schema: {
    color: { type: "string", default: "#0000FF" },
    play_image_src: { type: "string", default: "#play-btn-img" },
    pause_image_src: { type: "string", default: "#pause-btn-img" },
    src: { type: "string", default: "#vid1" },
    sound_src: { type: "string", default: "#audio1" },
    el: { type: "selector" },
  },
  init: function () {
    var self = this;
    this.play_image = document.createElement("a-image");
    this.play_image.setAttribute("id", "play-btn");
    this.video_selector = this.data.src;
    this.video_el = document.querySelector(this.video_selector);
    this.audio_el = document.querySelector(this.data.sound_src);
    self.play_image_src = "#play-btn-img";
    self.pause_image_src = "#pause-btn-img";

    this.play_image.setAttribute("class", "clickable");

    if (this.video_el.paused) {
      this.play_image.setAttribute("src", self.play_image_src);
    } else {
      this.play_image.setAttribute("src", self.pause_image_src);
    }

    this.video_el.addEventListener("ended", function () {
      self.play_image.setAttribute("src", self.play_image_src);
    });

    // Change icon to 'pause' on start.
    this.video_el.addEventListener("pause", function () {
      self.play_image.setAttribute("src", self.play_image_src);
    });
    // Change icon to 'play' on pause.
    this.video_el.addEventListener("playing", function () {
      self.play_image.setAttribute("src", self.pause_image_src);
    });
    this.el.appendChild(this.play_image);
    this.el.addEventListener("click", function () {
      // Handle click event
      console.log("Cursor clicked!");
      if (self.video_el.paused) {
        self.video_el.play();
        self.audio_el.play();
        self.play_image.setAttribute("src", self.pause_image_src);
      } else {
        self.video_el.pause();
        self.audio_el.pause();
        self.play_image.setAttribute("src", self.play_image_src);
      }
    });
  },
});

function sceneClick(event) {
  console.log("Scene clicked");
  const playBtn = document.getElementById("play-btn");
  if (playBtn) {
    playBtn.setAttribute(
      "animation",
      "property: opacity; to: 1; dur: 1000; easing: easeInOutQuad"
    );
    const video = document.querySelector("#vid1");
    if (video && !video.paused) {
      // Clear any existing timeout
      const existingTimeoutId = playBtn.getAttribute("data-timeout-id");
      if (existingTimeoutId) {
        clearTimeout(existingTimeoutId);
      }
      const timeoutId = setTimeout(() => {
        playBtn.setAttribute(
          "animation",
          "property: opacity; to: 0; dur: 1000; easing: easeInOutQuad"
        );
      }, 2000);
      playBtn.setAttribute("data-timeout-id", timeoutId);
    }
  }
}

function switchVideo(to) {

  if (to === 0) {
    to = 1;
  }

  const toVideo = document.querySelector("#vid" + to);
  // get src attribute of tool-bar
  const toolBar = document.querySelector("#tool-bar");
  const videoSphere = document.querySelector("a-videosphere");
  const src = toolBar.getAttribute("src");
  const fromVideo = document.querySelector(src);
  const audio = document.querySelector("#audio1");
  // get current play/pause state of fromVideo
  const isPaused = fromVideo.paused;
  // get current playback time
  const currentTime = fromVideo.currentTime;
  // set src attribute of tool-bar to toVideo
  toolBar.setAttribute("src", "#vid" + to);
  videoSphere.setAttribute("src", "#vid" + to);
  if (to === 1) {
    videoSphere.setAttribute("rotation", "0 -90 0");
  } else if (to === 2) {
    videoSphere.setAttribute("rotation", "0 15 0");
  } else if (to === 3) {
    videoSphere.setAttribute("rotation", "0 -90 0");
  }
  // pause fromVideo
  fromVideo.pause();
  // pause audio
  audio.pause();
  
  // pause/play toVideo
  toVideo.currentTime = currentTime;
  if (isPaused) {
    toVideo.pause();
    audio.pause();
  } else {
    toVideo.play();
    audio.play();
  }

}

function XR() {

  useEffect(() => {
    const video1 = document.querySelector("#vid1");
    const video1Src = process.env.PUBLIC_URL + "/videos/inside/output.m3u8";
    const video2 = document.querySelector("#vid2");
    const video2Src = process.env.PUBLIC_URL + "/videos/left/output.m3u8";
    const video3 = document.querySelector("#vid3");
    const video3Src = process.env.PUBLIC_URL + "/videos/outside/output.m3u8";
    
    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        crossOrigin: 'anonymous'
      });
      hls.loadSource(video1Src);
      hls.attachMedia(video1);
    } else {
      alert("HLS is not supported in this browser!");
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        crossOrigin: 'anonymous'
      });
      hls.loadSource(video2Src);
      hls.attachMedia(video2);
    }
    else {
      alert("HLS is not supported in this browser!");
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        crossOrigin: 'anonymous'
      });
      hls.loadSource(video3Src);
      hls.attachMedia(video3);
    } else {
      alert("HLS is not supported in this browser!");
    }
    // Provide instructions for the VR
    alert("To view the VR, click 'Enter VR' button in browser. Once you enter the VR mode, you can switch your angle after clicking the meta button on the controller, this will show all possible buttons for you to switch the angle.");
  }, []);
    

    return (
      
        <div className="App">
            <a-scene onClick={sceneClick}>
                <a-assets timeout="1000000">
                    <img id="play-btn-img" src={process.env.PUBLIC_URL + "/play.png"} alt="play-btn" crossOrigin="anonymous" preload="auto" />
                    <img id="pause-btn-img" src={process.env.PUBLIC_URL + "/pause.png"} alt="pause-btn" crossOrigin="anonymous" preload="auto" />
                    <video id="vid1" crossOrigin="anonymous" playsInline/>
                    <video id="vid2" crossOrigin="anonymous" playsInline/>
                    <video id="vid3"  crossOrigin="anonymous" playsInline/>
                    <audio id="audio1" src={process.env.PUBLIC_URL + "/sound.wav"} crossOrigin="anonymous" preload="auto"></audio>
                </a-assets>
                    <a-camera id="camera" look-controls position="0 1.6 0" raycaster="objects: .clickable">
                      <a-cursor id="cursor" color="blue"></a-cursor>
                      <a-entity id="tool-bar" cursor-listener geometry="primitive: plane" material="color: gray; opacity: 0.0" position="0 0 -1" scale="0.2 0.2 0.2"
                      src="#vid1" play_image_src="#play-btn-img" pause_image_src="#pause-btn-img"></a-entity>
                  </a-camera>
                <a-videosphere src="#vid1" rotation="0 -90 0"></a-videosphere>
                {/* Add the sound */}
                <a-sound src="#audio1" position="0 1.6 0"></a-sound>
            </a-scene>
            <Button variant="contained" color="primary" onClick={() => switchVideo(1)}>Switch to Angle inside Piano</Button>
            <Button variant="contained" color="secondary" onClick={() => switchVideo(2)}>Switch to Angle at the left of the Piano</Button>
            <Button variant="contained" color="success" onClick={() => switchVideo(3)}>Switch to Angle of the overall scene</Button>
            <Link to="/">
                <Button variant="contained" color="error">Back to Control Panel</Button>
            </Link>
        </div>
    );
}

export default XR;
