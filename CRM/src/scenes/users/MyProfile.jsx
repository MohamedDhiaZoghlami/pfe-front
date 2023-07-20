import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import Header from "../../components/Header";
import Profile from "../../assets/profile.png";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import UpdateProfile from "./UpdateProfile";

const MyProfile = () => {
  const [upp, setUpp] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="profile-wrapper">
      <Header title="My Profile" subtitle="See & Change your profile" />
      {upp ? (
        <UpdateProfile user={user} />
      ) : (
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
            <p className="p-info">
              Role : <span>{user.roles[0].name.split("_")[1]}</span>
            </p>
          </div>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setUpp(true)}
            >
              Update My profile
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default MyProfile;
