import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillEye } from "react-icons/ai";
import "./pagination.scss";
import { Link } from "react-router-dom";

const NewAdded = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_CALL}/opportunity/recentlyAdded`
      );
      console.log(response);
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="newAdded">
      {data?.map((e) => {
        let resultSplit = e.created_at.split("T")[0];
        return (
          <div className="newAddedBox">
            <h6>{e.name}</h6>
            <div className="bottom">
              <p>{resultSplit}</p>
              <Link to={`${e.id}`}>
                <AiFillEye className="customer-btn details" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewAdded;
