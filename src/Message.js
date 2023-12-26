import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { ThemeContext } from "./ThemeContext";
import axios from "axios";

function Message(props) {
  const { msgId } = useContext(ThemeContext);
  const { frdName } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  console.log(msgId);
  const pid = props.id;
  useEffect(() => {
    const getMessages = async () => {
      console.log(msgId, "msg id");
      const res = await axios.post("http://localhost:8000/getmessages", {
        pId: pid,
        friend: msgId,
      });
      console.log(res);
      setMessages(res);
      console.log(messages, "this is messages");
    };
    getMessages();
  }, [pid, msgId]);

  return (
    // <div>
    <div className="messages_bg">
      <div className="uppernavbar"></div>
      {/* {messages.map((row) => row.map((col) => <div>{col.msg}</div>))}; */}
      {messages.map((mess) => {
        return <li>{mess.msg}</li>;
      })}
    </div>
    // </div>
  );
}

export default Message;
