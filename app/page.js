import Image from "next/image";
import styles from "./page.module.css";

import WebCamRecorder from "@/components/webCamRecorder";

export default function Home() {
  return (
    <>
      <WebCamRecorder />
    </>
  );
}
