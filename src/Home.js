import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Side from "./Side";
import "./style.css";
import { ThemeContext } from "./ThemeContext";
import { useLocation } from "react-router-dom";
import Empty from "./Empty";
import Requests from "./Requests";
import Message from "./Message";

function Home() {
  // const location = useLocation();
  const { state } = useLocation();
  console.log(state.email);
  console.log(state.receivedId);
  const id = state.receivedId;
  console.log(id);
  const { darkMode } = useContext(ThemeContext);
  const { request } = useContext(ThemeContext);
  const { msgId } = useContext(ThemeContext);
  // console.log(request[0].empty);
  const reque = () => {
    console.log("came to if");
    if (request && request.length > 0) {
      if (request[0].empty) {
        return <Empty id={id} />;
      } else if (request[0].req) {
        return <Requests id={id} />;
      } else if (request[0].messegaes) {
        return <Message id={id} />;
      }
    }

    return null;
  };
  return (
    <div className="home">
      <div className="sidebar">
        <Side cur_id={id} />
      </div>
      <div className="border rounded-4 mt-2 min">{reque()}</div>
    </div>
  );
}

export default Home;
