// "use client";
// import { useState } from "react";
// import { RecordRTCPromisesHandler } from "recordrtc";

// export default function RecordRTC() {
//   const [recorder, setRecorder] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [videoBlob, setVideoBlob] = useState(null);
//   const [type, setType] = useState("video");

//   const startRecording = async () => {
//     const mediaDevices = navigator.mediaDevices;
//     const stream = await mediaDevices.getUserMedia({
//       video: { facingMode: "user" },
//       audio: true,
//     });
//     const recorder = new RecordRTCPromisesHandler(stream, { type: "video" });
//     await recorder.startRecording();
//     setRecorder(recorder);
//     setStream(stream);
//   };
//   const stopRecording = async () => {
//     if (recorder) {
//       await recorder.stopRecording();
//       const blob = await recorder.getBlob();
//       setVideoBlob(blob);
//       console.log(blob);
//       setStream(null);
//       setRecorder(null);
//     }
//   };
//   return (
//     <>
//       <button onClick={startRecording}>START</button>
//       <button onClick={stopRecording}>STOP</button>
//     </>
//   );
// }
