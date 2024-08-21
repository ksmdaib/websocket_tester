import "./App.css";
import { useEffect, useState } from "react";
import {
  C_WEB_CLIENT_CONNECTED,
  C_WEB_CLIENT_CONNECTED_COMPLETE,
} from "./Consts";

function App() {
  let [data, changeData] = useState("");

  const sampleData = {
    farm_id: "AIF001",
    // ---- 센서 ----
  };

  useEffect(() => {
    // const ws = new WebSocket("ws://127.0.0.1:8001/api/v1/ws/rmse/");
    // const ws = new WebSocket("ws://34.22.109.227:8001/api/v1/ws/rmse/");
    // const ws = new WebSocket("ws://34.64.137.155:8001/api/v1/ws/goatfarm/rmse/");
    // const ws = new WebSocket("ws://office.daios.net:8001/api/v1/ws/goatfarm/rmse/");
    // const ws = new WebSocket("ws://tapi.goatfarm.ai:8001/api/v1/ws/goatfarm/rmse/");
    const ws = new WebSocket("wss://api.goatfarm.ai/api/v1/ws/goatfarm/rmse/");
    ws.binaryType = 'arraybuffer'; // 웹소켓에서 바이너리 데이터를 받도록 설정

    ws.onopen = () => {
      const buffer = new Uint8Array([C_WEB_CLIENT_CONNECTED]);
      ws.send(buffer.buffer); // ArrayBuffer를 보내야 하므로 buffer.buffer 사용
      console.log("C_WEB_CLIENT_CONNECTED : [" + buffer[0] + "]");
    };

    ws.onmessage = (event) => {
      console.log("Received data: ", event.data);
      const buffer = new Uint8Array(event.data);
      processData(buffer);
    };

    return () => ws.close(); // 컴포넌트 언마운트 시 웹소켓 연결 닫기
  }, []);

  const processData = (buffer) => {
    const decoder = new TextDecoder('utf-8');
    const decodedData = decoder.decode(buffer);
    try {
      const jsonData = JSON.parse(decodedData);
      changeData(jsonData);
      console.log("Processed data:", jsonData);
    } catch (error) {
      console.error("Error parsing JSON data: ", error);
    }
  };

  return (
    <div className="App">
      <div>Data: {JSON.stringify(data)}</div>
      <br />
      <div>Sample Data: {JSON.stringify(sampleData)}</div>
    </div>
  );
}

export default App;
