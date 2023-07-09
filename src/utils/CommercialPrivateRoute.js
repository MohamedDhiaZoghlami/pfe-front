import { Navigate } from "react-router-dom";

const CommercialPrivateRoute = ({ isSignedIn, role, children }) => {
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  } else if (role !== "ROLE_COMMERCIAL") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default CommercialPrivateRoute;
