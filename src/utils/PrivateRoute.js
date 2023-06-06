import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isSignedIn, children }) => {
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
