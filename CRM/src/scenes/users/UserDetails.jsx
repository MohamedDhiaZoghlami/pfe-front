import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Profile from "../../assets/profile.png";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserDetails = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();
  useEffect(() => {
    getUser(id);
  }, [id]);
  const getUser = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/user/${id}`
      );
      console.log(response);
      setUser({
        ...response.data,
        role: response.data.roles[0].name.split("_")[1],
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="profile-wrapper">
      <Header title="User Profile" subtitle="See Specific User" />

      <>
        <div className="profile-content">
          <div className="img-wrapper">
            <img
              src={
                user.image
                  ? `${process.env.REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN}/profile${user.firstName}_${user.image}`
                  : Profile
              }
              alt="profile"
            />
            <p className="profileName">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <p className="p-info">
            Email : <span>{user.username}</span>
          </p>
          <p className="p-info">
            Address : <span>{user.adress}</span>
          </p>
          <p className="p-info">
            Phone Number : <span>{user.phone}</span>
          </p>
          {user.role && (
            <p className="p-info">
              Role : <span>{user.role}</span>
            </p>
          )}
        </div>
      </>
    </div>
  );
};

export default UserDetails;
