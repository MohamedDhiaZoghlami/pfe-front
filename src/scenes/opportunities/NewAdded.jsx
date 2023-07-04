import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      {data.map((e) => (
        <p>{e.name}</p>
      ))}
    </div>
  );
};

export default NewAdded;
