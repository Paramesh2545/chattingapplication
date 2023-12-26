import React, { useEffect, useState } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
function Requests(props) {
  const [requests, setRequests] = useState([]);
  const [Users, setUsers] = useState([]);
  const [details, setDetails] = useState([]);
  const [fromIds, setFromIds] = useState({});
  const [images, setImages] = useState([]);
  console.log(props.id);
  const presentUserId = props.id;

  useEffect(() => {
    const getRequests = async (e) => {
      try {
        const res = await axios.post("http://localhost:8000/requests", {
          presentUserId: presentUserId,
        });
        if (res.data.length === 0) {
          console.log("no requests");
        }
        console.log(res.data, "this is requests");
        setRequests(res.data);
        // res.data.map((response) => {
        //   console.log(response, "response.map");
        //   setFromIds(response.fromId);
        //   return null;
        // });
      } catch (err) {
        console.log("error in getting the requests", err);
      }
    };
    getRequests();
    setUsers(requests);
    for (const key in requests) {
      if (Object.prototype.hasOwnProperty.call(requests, key)) {
        setUsers[key] = requests[key];
      }
    }
    // const getDetails = async () => {
    //   try {
    //     const res = await axios.post("http://localhost:8000/getDetails", {
    //       Users,
    //     });
    //     console.log(res.data);
    //   } catch (err) {
    //     console.log("this error", err);
    //   }
    // };
    // getDetails();
  }, [presentUserId]);
  console.log(Users, "this is from id");
  console.log(requests, "hola");
  console.log(fromIds, "from ids ra babu");
  const handleAccept = async (from, to) => {
    console.log("came to accept btn");
    try {
      const res = await axios.post("http://localhost:8000/accept", {
        from: from,
        to: to,
      });
    } catch (err) {
      console.log(err);
    }
  };
  // const img = "http://localhost:8000/images/" + dp;
  return (
    <div className="d-flex flex-column min">
      <div className="d-flex jusify-content-cneter">
        <h1>REQUESTS</h1>
      </div>
      <div className=""></div>
      <div className="d-flex flex-column">
        {requests.map((inner) => (
          <li key={inner.id} className="d-flex border rounded-4 w-100">
            <img
              src={`http://localhost:8000/images/${inner.dp}`}
              className="m-2 border rounded-5"
              alt="http://localhost:3000/public/images/user.png"
            ></img>
            <p className="m-3">User Id:- {inner.fromId}</p>
            <p className="m-3">User Name:-{inner.user_name}</p>
            {inner.status === 0 && (
              <button
                className="btn btn-success mx-2"
                onClick={() => handleAccept(inner.fromId, inner.toId)}
              >
                accept
              </button>
            )}
            {inner.status === 0 && (
              <button className="btn btn-danger">reject</button>
            )}
            {inner.status === 1 && (
              <button className="btn btn-success mx-2">accepted</button>
            )}
            {inner.status === 2 && (
              <button className="btn btn-danger mx-2">rejeted</button>
            )}
          </li>
        ))}
      </div>
    </div>
  );
}

export default Requests;
