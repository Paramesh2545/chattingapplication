import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { FaBell, FaLifeRing } from "react-icons/fa";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import "./style.css";
import { ThemeContext } from "./ThemeContext";
import axios from "axios";
// import { useTheme } from "./ThemeContext";

function Side(props) {
  const [dark, setDark] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { msgId, setMsgId } = useContext(ThemeContext);
  const { frdName, setFrdName } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { cur_id } = props;
  const { requests, setRequests } = useContext(ThemeContext);
  const [dp, setDp] = useState("");
  const [friends, setFriends] = useState([[]]);

  // const updatedFriends = [];
  console.log("current id users id");
  console.log(cur_id);
  // const getdp = async () => {
  //   console.log("came to get dp method");
  //   try {
  //     const res = await axios.post("http://localhost:8000/getdp", {
  //       id: cur_id,
  //     });
  //     if (res.length > 0) {
  //       console.log("this is res from the dp");
  //       console.log(res);
  //     }
  //   } catch (err) {
  //     console.log("error in fetching the dp");
  //   }
  // };
  useEffect(() => {
    const getdp = async () => {
      try {
        const response = await axios
          .post("http://localhost:8000/getdp", { id: cur_id })
          .then((response) => {
            setDp(response.data.dp);
          });
      } catch (err) {
        console.log("error in getting the user dp", err);
      }
    };

    const gfriends = async () => {
      try {
        const res = await axios
          .post("http://localhost:8000/getFriends", { cur_id: cur_id })
          .then((res) => {
            console.log(res);
            setFriends(res.data);
            console.log("this is friends", friends);
          });
      } catch (err) {
        console.log(err);
      }
    };
    getdp();
    gfriends();
  }, [cur_id]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log(darkMode);
  };

  const gotoreq = (e) => {
    setRequests([
      {
        empty: false,
        req: true,
        messegaes: false,
      },
    ]);
  };

  const seachUser = async (e) => {
    setSearch(e.target.value);
    console.log(search);
    console.log("this is search");
    if (search.length !== 0) {
      try {
        const res = await axios.post("http://localhost:8000/home", {
          search: search,
          cur_id: cur_id,
        });
        if (res.length === 0) {
          setUsers();
        }
        console.log(res.data, "this is res.data");
        setUsers(res.data);
      } catch (err) {
        console.log("error in  data");
      }
    }
  };

  const addFriendNew = async (reciever, name) => {
    try {
      const res = await axios.post("http://localhost:8000/side", {
        cur_id: cur_id,
        reciever: reciever,
        name: name,
      });
    } catch (err) {
      console.log("error in sending the request");
    }
    console.log({ reciever });
  };
  const img = "http://localhost:8000/images/" + dp;

  const openmessage = (e, id, name) => {
    console.log(id, "this is userid from the side of messages");
    setRequests([
      {
        empty: false,
        req: false,
        messegaes: true,
      },
    ]);
    // const thisid = id;
    // console.log(thisid);
    setMsgId(id);
    setFrdName(name);
    console.log(msgId, "this is msg id from side.js");
    console.log(name, "from the side js");
  };

  return (
    // <ThemeContext.Provider value={darkMode}>
    <div>
      <div className=" m-2 border vh-100 rounded-4 position-relative ">
        <div className="d-flex  justify-content-between mb-4">
          <div className="d-flex mx-2 mt-2">
            {img && <img src={img} alt="p" size="25"></img>}
            {/* <img
              src="http://localhost:3000/images/man.png"
              alt="p"
              size="25"
            ></img> */}
            <h5 className="mx-2 fs-4">Chats</h5>
          </div>
          <div className="mx-2 mt-2" id={dark ? "root" : "light-mode"}>
            <FaBell size="25" onClick={gotoreq} />
            <CiLight
              size="25"
              id={dark ? "light" : "root"}
              onClick={toggleDarkMode}
            />
          </div>
        </div>
        <div className="position-relative">
          <div className="position-absolute top-50 start-0 translate-middle-y ms-2">
            <IoIosSearch size={25} />
          </div>
          <div className="w-100">
            <input
              value={search}
              type="text"
              placeholder="Search People"
              onChange={seachUser}
              className="w-100 p-2 rounded-2 border border-1"
            ></input>
          </div>
        </div>
        <div className="usersbar">
          {users.map((user) => (
            <li key={user.id}>
              {user.user_name}
              <button
                onClick={(e) => addFriendNew(user.user_id, user.user_name)}
                id={user.user_id}
              >
                add friend
              </button>
              <br />
            </li>
          ))}
        </div>
        <div className="border-top mt-2"></div>
        <div className="mt-1 mx-1">
          <h3>friends</h3>
          <div>
            <ul>
              {friends.map((frd) => (
                <li
                  key={frd.id}
                  className="d-flex flex-row mx-0"
                  onClick={(e) => openmessage(e, frd.user_id, frd.user_name)}
                >
                  <img src={`http://localhost:8000/images/${frd.dp}`}></img>
                  <p className="mx-3">{frd.user_name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Side;
