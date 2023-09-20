import Image from "next/image";
import styles from "./page.module.css";

import WebCamRecorder from "@/components/webCamRecorder";
// import RecordRTC from "@/components/recordRTC";

export default function Home() {
  return (
    <>
      <WebCamRecorder />
      {/* <RecordRTC /> */}
    </>
  );
}
