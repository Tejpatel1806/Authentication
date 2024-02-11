import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
function App() {
  const socket = useMemo(() => io("http://localhost:8001"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketid, setSocketid] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);
  const handlersubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    // setRoom("");
  };
  useEffect(() => {
    socket.on("connect", () => {
      //aam socket.on "connect" lakhva thi socket connect thai jase
      setSocketid(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("receiver", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
      console.log(messages);
    });
    // socket.on("welcome", (data) => {
    //   console.log(data);
    // });

    //ahi aapde useEffect nu return statement means jyare component unmount thase tyare aa execute thase ane ema socket ne aapde disconnect karsu
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <div>
        <h1>Websocket .IO {socketid}</h1>
        <form onSubmit={handlersubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          ></input>
          <button type="submit">Send</button>
        </form>
      </div>
      <div>
        {messages.map((item) => (
          <h3>{item}</h3>
        ))}
      </div>
    </>
  );
}

export default App;
