import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Header from "../../components/Header";
import "./pagination.scss";
import CloseIcon from "@mui/icons-material/Close";
import Select from "react-select";

const OpportunityDetails = () => {
  let { id } = useParams();
  const [datas, setDatas] = useState({});
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIgnore, setShowIgnore] = useState(false);
  const [showParticipate, setShowParticipate] = useState(false);
  const options = [
    {
      value: "Low",
      label: "Low",
    },
    {
      value: "Medium",
      label: "Medium",
    },
    {
      value: "High",
      label: "High",
    },
  ];
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
  const ignoreOpportunity = async () => {
    setLoading(true);
    const opp = {
      ...datas,
      value: "Ignored",
      decision: "Ignored",
      stage: "Ignored",
    };

    try {
      const result = axios.put(
        `${process.env.REACT_APP_BACK_CALL}/opportunity/update/${id}`,
        opp
      );
      toast.success("your decision has been made.");
    } catch (e) {
      console.log(e);
      toast.error("something went wrong.");
    }
    setLoading(false);
    setShowIgnore(false);
  };
  const participateOpp = async () => {
    setLoading(true);
    const opp = {
      ...datas,
      value: value,
      decistion: "Participate",
      stage: "Deciding",
    };

    try {
      const result = axios.put(
        `${process.env.REACT_APP_BACK_CALL}/opportunity/update/${id}`,
        opp
      );
      toast.success("your decision has been made.");
    } catch (e) {
      console.log(e);
      toast.error("something went wrong.");
    }
    setLoading(false);
    setShowParticipate(false);
  };
  function handleSelectedChoix(e) {
    setValue(e.value);
    // handle other stuff like persisting to store etc
  }
  if (loading) {
    return <p>loading...</p>;
  } else {
    return (
      <div className="opp-wrapper">
        <Header
          title="Opportunity details"
          subtitle="Manage this opportunity"
        />
        {showIgnore && (
          <div className="ignorewrapper">
            <div className="ignorecontent">
              <CloseIcon
                className="icons"
                onClick={() => setShowIgnore(false)}
              />
              <h2>Are you sure you want to ignore this opportunity ?</h2>
              <div className="btnss">
                <div className="no" onClick={() => setShowIgnore(false)}>
                  Cancel
                </div>
                <div className="yes" onClick={() => ignoreOpportunity()}>
                  Yes
                </div>
              </div>
            </div>
          </div>
        )}
        {showParticipate && (
          <div className="ignorewrapper">
            <div className="ignorecontent">
              <CloseIcon
                className="icons"
                onClick={() => setShowParticipate(false)}
              />
              <h2>
                If you decided to participate please give value to this
                opportunity.
              </h2>
              <Select
                options={options}
                sx={{ gridColumn: "span 2" }}
                onChange={handleSelectedChoix}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    backgroundColor: "transparent",
                    color: "white",
                  }),
                  option: (
                    styles,
                    { data, isDisabled, isFocused, isSelected }
                  ) => {
                    return {
                      ...styles,
                      backgroundColor: "white",
                      color: "black",
                    };
                  },
                  input: (styles) => ({
                    ...styles,
                    color: "grey",
                    width: "300px",
                  }),
                  placeholder: (styles) => ({
                    ...styles,
                    color: "grey",
                  }),
                  singleValue: (styles, { data }) => ({
                    ...styles,
                    color: "grey",
                  }),
                }}
              />
              <div className="btnss">
                <div className="yes" onClick={() => participateOpp()}>
                  Confirm
                </div>
              </div>
            </div>
          </div>
        )}
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
        {datas.value === "Not_assigned_yet" && (
          <div className="btns-opp">
            <div className="no" onClick={() => setShowIgnore(true)}>
              Ignore
            </div>
            <div className="yes" onClick={() => setShowParticipate(true)}>
              Participate
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default OpportunityDetails;
