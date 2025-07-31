import React, { useState, useRef } from "react";

function VoicePage() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gravação de Voz</h1>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Parar" : "Gravar"}
      </button>
      {audioURL && (
        <div style={{ marginTop: "1rem" }}>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
}

export default VoicePage;
