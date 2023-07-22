import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Header from "../../components/Header";
import "./pagination.scss";
import ArticleIcon from "@mui/icons-material/Article";

const OfferDet = () => {
  let { id } = useParams();
  const [datas, setDatas] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getOfferById(id);
  }, []);
  const getOfferById = async (id) => {
    setLoading(true);
    try {
      const opportunity = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/offer/${id}`
      );
      console.log(opportunity.data);
      setDatas({
        ...opportunity.data,
      });
      const filess = opportunity.data.files.split("*");
      setFiles(...files, filess);
    } catch (e) {
      toast.error("Something Went wrong, try again.");
    }
    setLoading(false);
  };
  const submitOffer = async () => {
    setLoading(true);
    const ddd = {
      ...datas,
      status: "Submitted",
      submitted_at: Date.now(),
    };
    const opps = {
      ...datas.opportunity,
      last_updated_at: Date.now(),
      stage: "Negotiation",
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_CRM_API_BACKEND}/offer/update/${id}`,
        ddd
      );
      setDatas({ ...ddd });
      const opp = await axios.put(
        `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/update/${datas.opportunity.id}`,
        opps
      );
      toast.success("Offer Submitted");
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  const acceptedOffer = async () => {
    setLoading(true);
    const ddd = {
      ...datas,
      status: "accepted",
      response_date: Date.now(),
    };

    const opps = {
      ...datas.opportunity,
      last_updated_at: Date.now(),
      stage: "Closed_won",
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_CRM_API_BACKEND}/offer/update/${id}`,
        ddd
      );
      setDatas({ ...ddd });
      const opp = await axios.put(
        `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/update/${datas.opportunity.id}`,
        opps
      );
      toast.success("Thank you for your work");
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  const rejectedOffer = async () => {
    setLoading(true);
    const ddd = {
      ...datas,
      status: "rejected",
      response_date: Date.now(),
    };

    const opps = {
      ...datas.opportunity,
      last_updated_at: Date.now(),
      stage: "Closed_lost",
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_CRM_API_BACKEND}/offer/update/${id}`,
        ddd
      );
      setDatas({ ...ddd });
      const opp = await axios.put(
        `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/update/${datas.opportunity.id}`,
        opps
      );
      toast.success("Thank you for your work");
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  if (loading) {
    return <p>loading...</p>;
  } else {
    return (
      <div className="opp-wrapper">
        <Header title="Offer details" subtitle="Detailed offer" />
        {datas &&
          datas.opportunity &&
          datas.name &&
          datas.description &&
          datas.status &&
          datas.last_updated_By &&
          datas.last_updated_at &&
          datas.created_By &&
          datas.created_at && (
            <div className="opp-container">
              <p>
                Opportunity Name : <span>{datas.opportunity.name}</span>
              </p>
              <p>
                Customer : <span>{datas.opportunity.customer.name}</span>
              </p>
              <p>
                From where we heard about This Opportunity:{" "}
                <span>{datas.opportunity.fromWhere}</span>{" "}
              </p>
              <p>
                Opportunity Expected close date :{" "}
                <span>
                  {datas.opportunity.expected_close_date.split("T")[0]}
                </span>{" "}
              </p>
              <p>
                Opportunity Value : <span>{datas.opportunity.value}</span>
              </p>
              <p>
                Offer Name : <span>{datas.name}</span>
              </p>
              <p>
                Offer Description : <span>{datas.description}</span>{" "}
              </p>
              <p>
                Offer Status : <span>{datas.status}</span>
              </p>
              {datas.submitted_at ? (
                <p>
                  {" "}
                  Offer Submitted at :{" "}
                  <span>{datas.submitted_at.split("T")[0]}</span>
                </p>
              ) : null}
              {datas.response_date ? (
                <p>
                  {" "}
                  Offer Responded at :{" "}
                  <span>{datas.response_date.split("T")[0]}</span>
                </p>
              ) : null}
              <p>
                This was created by : <span>{datas.created_By}</span> at :{" "}
                <span>{datas.created_at.split("T")[0]}</span>
              </p>
              <p>
                This was lastly updated by :{" "}
                <span>{datas.last_updated_By}</span> at :{" "}
                <span>{datas.last_updated_at.split("T")[0]}</span>
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
              <div className="offerDetBtns">
                {datas.status === "On_going" && (
                  <div className="submitOffer" onClick={() => submitOffer()}>
                    Submit This Offer
                  </div>
                )}
                {datas.status === "Submitted" && (
                  <div className="respBtns">
                    <p>
                      *Please Respond to this as soon as you get a response :
                    </p>
                    <div className="respOfferN" onClick={() => rejectedOffer()}>
                      Offer Rejected
                    </div>
                    <div className="respOfferY" onClick={() => acceptedOffer()}>
                      Offer Accepted
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    );
  }
};

export default OfferDet;
