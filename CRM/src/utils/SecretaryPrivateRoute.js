import { Navigate } from "react-router-dom";

const SecretaryPrivateRoute = ({ isSignedIn, role, children }) => {
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  } else if (role !== "ROLE_SECRETARY") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default SecretaryPrivateRoute;
