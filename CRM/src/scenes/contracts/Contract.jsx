import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import DownloadButton from "./DownloadButton";

const Contract = ({ data }) => {
  const { id } = useParams();
  const [contract, setContract] = useState({});

  useEffect(() => {
    fetchContract(id);
  }, [id]);
  const fetchContract = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/contract/${id}`
      );
      setContract({
        ...response.data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="opp-wrapper relV">
      <Header title="Contract details" subtitle="Manage Your Contract" />
      {contract &&
        contract.name &&
        contract.created_at &&
        contract.description &&
        contract.amount &&
        contract.payXmonths &&
        contract.payXsteps &&
        contract.dateOfFullfillment &&
        contract.created_By && (
          <>
            <h1>Contract Title : {contract.name}</h1>
            <p className="filledP">Customer :</p>
            <p>{contract.customer.name}</p>
            <p className="filledP">Amount :</p>
            <p>{contract.amount}</p>
            <p className="filledP">Payment Process :</p>
            <p>every {contract.payXmonths} months</p>
            <p className="filledP">Payment Steps :</p>
            <p>In {contract.payXsteps} steps</p>
            <p className="filledP">Fullfilment Date :</p>
            <p>{contract.dateOfFullfillment.split("T")[0]}</p>
            <p className="filledP">Description :</p>
            <p>{contract.description}</p>
            <p className="filledP">Created At :</p>
            <p>{contract.created_at.split("T")[0]}</p>
            <p className="filledP">Created By :</p>
            <p>{contract.created_By}</p>
            <DownloadButton data={contract} />
          </>
        )}
    </div>
  );
};

export default Contract;
