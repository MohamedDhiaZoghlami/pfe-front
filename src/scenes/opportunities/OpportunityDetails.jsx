import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Header from "../../components/Header";
import "./pagination.scss";

const OpportunityDetails = () => {
  let { id } = useParams();
  const [datas, setDatas] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getOpportunity(id);
  }, []);
  const getOpportunity = async (id) => {
    setLoading(true);
    try {
      const opportunity = await axios.get(
        `${process.env.REACT_APP_BACK_CALL}/opportunity/${id}`
      );
      setDatas({
        ...opportunity.data,
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
              <p>
                This was created by : <span>{datas.created_By}</span> at :{" "}
                <span>{datas.created_at.split("T")[0]}</span>
              </p>
              <p>
                This was lastly updated by :{" "}
                <span>{datas.last_updated_By}</span> at :{" "}
                <span>{datas.last_updated_at.split("T")[0]}</span>
              </p>
            </div>
          )}
        <div className="btns-opp">
          <div className="no">Ignore</div>
          <div className="yes">Participate</div>
        </div>
      </div>
    );
  }
};

export default OpportunityDetails;
