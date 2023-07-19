import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useEffect, useState } from "react";
import axios from "axios";

const Line = () => {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/user/commercial/chart`
      );
      const setss = response.data.map((e) => {
        console.log(e);
        let scores = {
          id: e.agentFirstName + " " + e.agentLastName,
          color: getRandomColor(),
          data: [
            {
              x: "January",
              y: e.scores[0],
            },
            {
              x: "February",
              y: e.scores[1],
            },
            {
              x: "March",
              y: e.scores[2],
            },
            {
              x: "April",
              y: e.scores[3],
            },
            {
              x: "Mai",
              y: e.scores[4],
            },
            {
              x: "June",
              y: e.scores[5],
            },
            {
              x: "July",
              y: e.scores[6],
            },
            {
              x: "August",
              y: e.scores[7],
            },
            {
              x: "Septmeber",
              y: e.scores[8],
            },
            {
              x: "October",
              y: e.scores[9],
            },
            {
              x: "November",
              y: e.scores[10],
            },
            {
              x: "December",
              y: e.scores[11],
            },
          ],
        };
        return scores;
      });
      setChartData([...setss]);
    } catch (e) {
      console.log(e);
    }
  };
  const getRandomColor = () => {
    let color = "#";
    let dzoo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
    for (let i = 0; i < 6; i++) {
      let a = Math.floor(Math.random() * dzoo.length);
      color += a;
    }
    return color;
  };
  return (
    <Box m="20px">
      <Header
        title="Commercial Agents Statistics"
        subtitle="See how your agents are doing throught the year"
      />
      <Box height="75vh">
        <LineChart datas={chartData} />
      </Box>
    </Box>
  );
};

export default Line;
