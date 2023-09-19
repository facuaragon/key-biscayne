"use client";
import styles from "./webCamRecorder.module.css";
import { useEffect, useRef, useState } from "react";

function WebCamRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [downloadLink, setDownloadLink] = useState("");
  const streamRecorderRef = useRef(null);
  const [error, setError] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  useEffect(() => {
    if (isRecording) {
      return;
    }
    if (chunks.length === 0) {
      return;
    }
    const blob = new Blob(chunks, {
      type: "video/mp4",
    });

    setDownloadLink(URL.createObjectURL(blob));
    setVideoPreviewUrl(URL.createObjectURL(blob));
    setChunks([]); // Clear the chunks
  }, [isRecording, chunks]);

  useEffect(() => {
    async function prepareStream() {
      function gotStream(stream) {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }

      async function getStream() {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
        const constraints = { video: { facingMode: "user" }, audio: true };
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          gotStream(stream);
        } catch (error) {
          setError(error);
        }
      }
      await getStream();
    }
    prepareStream();
  }, []);

  if (typeof window !== "undefined") {
    // The code that relies on the 'window' object should be placed here
    const isSafariMobile =
      window.navigator.userAgent.indexOf("Safari") !== -1 &&
      window.navigator.userAgent.indexOf("Mobile") !== -1;

    const videoFormat = isSafariMobile ? "video/mp4" : "video/webm";

    // Rest of your code that uses 'videoFormat'
  } else {
    // Handle the case where 'window' is not available, e.g., provide a default value.
    const videoFormat = "video/mp4";

    // You can also throw an error or log a message to indicate the issue.
    console.error("window is not available. Defaulting to video/mp4 format.");
  }

  function startRecording() {
    setVideoPreviewUrl(null);

    if (isRecording) {
      return;
    }
    if (!streamRef.current) {
      return;
    }
    setVideoPreviewUrl(null);
    setChunks([]); // Clear the chunks when starting recording
    const mimeType = `${videoFormat};codecs=${videoCodec},opus`;
    streamRecorderRef.current = new MediaRecorder(streamRef.current, {
      mimeType,
    });
    streamRecorderRef.current.start();
    streamRecorderRef.current.ondataavailable = function (event) {
      setChunks((prevChunks) => [...prevChunks, event.data]);
    };
    setIsRecording(true);
  }

  function stopRecording() {
    setIsRecording(false);
    if (!streamRecorderRef.current) {
      return;
    }
    streamRecorderRef.current.stop();
  }

  return (
    <div className={styles.container}>
      <img
        src="/LOGO_KEYBISCAYNE_BLANCO.png"
        alt="logo key-biscayne"
        className={styles.logo}
      />
      {/* <h1 className={styles.title}>Que es para vos Maternar</h1> */}
      <div className={styles.video}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={videoPreviewUrl ? { display: "none" } : {}}
        />
        {videoPreviewUrl && (
          <video src={downloadLink} controls autoPlay playsInline />
        )}
      </div>

      <div
        className={styles.button}
        onClick={!isRecording ? startRecording : stopRecording}
      >
        {!isRecording ? (
          <img src="/REC-button.png" alt="REC" width={80} />
        ) : (
          <img src="/Stop-REC-button.png" alt="STOP" width={80} />
        )}
      </div>
      {/* <div>
          <button onClick={startRecording} disabled={isRecording}>
            Grabar
          </button>
          <button onClick={stopRecording} disabled={!isRecording}>
            Parar
          </button>
        </div> */}
      {/* {downloadLink && (
            <a href={downloadLink} download="file.mp4">
              Descargar
            </a>
          )} */}
      <img
        src="/ISOTIPO_KEYBISCAYNE_BLANCO.png"
        alt="isotipo key-biscayne"
        className={styles.isotipo}
      />
      <div>{error && <p>{error.message}</p>}</div>
    </div>
  );
}

export default WebCamRecorder;
