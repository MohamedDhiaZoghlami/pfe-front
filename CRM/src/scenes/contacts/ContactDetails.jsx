import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./pagination.scss";

const ContactDetails = () => {
  let { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getContact(id);
  }, []);
  const getContact = async (contactId) => {
    setLoading(true);
    try {
      const contact = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/contacts/${contactId}`
      );
      setData({
        ...contact.data,
      });
    } catch (e) {
      toast.error("Something Went wrong, try again.");
    }
    setLoading(false);
  };
  if (loading) {
    return <p>loading...</p>;
  }
  return (
    <div className="c_details">
      <p>First Name : {data.firstName}</p>
      <p>Last Name : {data.lastName}</p>
      <p>Email : {data.email}</p>
      <p>Phone : {data.phone}</p>
      <p>Created By : {data.created_By}</p>
      <p>Created At : {data.created_at}</p>
      <p>Last Updated By : {data.last_updated_By}</p>
      <p>Last Updated At : {data.last_updated_at}</p>
    </div>
  );
};

export default ContactDetails;
