import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Header from "../../../components/Header";
import "./pagination.scss";
import ArticleIcon from "@mui/icons-material/Article";

const AgentOppDetails = () => {
  let { id } = useParams();
  const [datas, setDatas] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getOpportunity(id);
  }, []);
  const getOpportunity = async (id) => {
    setLoading(true);
    try {
      const opportunity = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/${id}`
      );
      setDatas({
        ...opportunity.data,
      });
      const filess = opportunity.data.file.split("*");
      setFiles(...files, filess);
    } catch (e) {
      toast.error("Something Went wrong, try again.");
    }
    setLoading(false);
  };
  const startWorkingOn = async () => {
    setLoading(true);
    const opp = {
      ...datas,
      stage: "Working_on",
    };
    try {
      const opportunity = await axios.put(
        `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/update/${id}`,
        opp
      );
      setDatas({
        ...opp,
      });
    } catch (e) {
      toast.error("Something Went wrong, try again.");
    }
    setLoading(false);
  };
  if (loading) {
    return <p>loading...</p>;
  } else {
    return (
      <div className="opp-wrapper">
        <Header
          title="Opportunity details"
          subtitle="Manage this opportunity"
        />
        {datas &&
          datas.name &&
          datas.customer.name &&
          datas.expected_close_date &&
          datas.last_updated_at &&
          datas.created_at && (
            <div className="opp-container">
              <p>
                Name : <span>{datas.name}</span>
              </p>
              <p>
                Description : <span>{datas.description}</span>{" "}
              </p>
              <p>
                Customer : <span>{datas.customer.name}</span>{" "}
              </p>
              <p>
                From where we heard about : <span>{datas.fromWhere}</span>{" "}
              </p>
              <p>
                Expected close date :{" "}
                <span>{datas.expected_close_date.split("T")[0]}</span>{" "}
              </p>
              <p>
                Value : <span>{datas.value}</span>
              </p>
              <p>
                Stage : <span>{datas.stage}</span>
              </p>
              <p>Documents :</p>
              <div className="fileContainer">
                {files?.map((e, i) => {
                  if (i === 0) {
                    return;
                  } else {
                    return (
                      <a
                        href={`${process.env.REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN}/opp${datas.name}_${e}`}
                        key={i}
                        className="fileDownload"
                      >
                        <ArticleIcon className="fileIcon" />
                        {e}
                      </a>
                    );
                  }
                })}
              </div>
            </div>
          )}
        {datas.stage === "Assigned" && (
          <div className="btns-opp">
            <div className="yess" onClick={() => startWorkingOn()}>
              Start Working On it
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default AgentOppDetails;
