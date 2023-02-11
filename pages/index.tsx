import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

export default function App() {
  const webcamRef = useRef<Webcam>(null);
  const [toggleTab, setToggleTab] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(
    null
  );
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  function takeScreenshot() {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setCurrentScreenshot(screenshot);
    }
  }

  function ocr() {
    if (!currentScreenshot) return;
    Tesseract.recognize(currentScreenshot, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data }) => {
        setConfidence(data.confidence);
        setOcrResult(data.text);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="w-5/6 mx-auto">
      {toggleTab ? (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/webp"
          // videoConstraints={{ facingMode: { exact: "environment" } }}
        />
      ) : null}
      <div>
        <button onClick={() => setToggleTab(!toggleTab)}>Toggle webcam</button>
        <button onClick={() => takeScreenshot()}>Take pic</button>
        <button onClick={() => ocr()}>OCR</button>
      </div>
      <div>
        <p>{ocrResult}</p>
        <p>{confidence?.toString()}</p>
      </div>
    </div>
  );
}
