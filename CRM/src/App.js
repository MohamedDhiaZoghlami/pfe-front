import { Routes, Route } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import Dashboard from "./scenes/dashboard";
import Customers from "./scenes/customers";
import UpdateCustomer from "./scenes/customers/UpdateCustomer";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import SignIn from "./pages/Signin/SignIn";
import AllInOne from "./scenes/AllInOne";
import PrivateRoute from "./utils/PrivateRoute";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import CustomerDetails from "./scenes/customers/CustomerDetails";
import ContactDetails from "./scenes/contacts/ContactDetails";
import UpdateContact from "./scenes/contacts/UpdateContact";
import Users from "./scenes/users";
import Opportunities from "./scenes/opportunities";
import OpportunityDetails from "./scenes/opportunities/OpportunityDetails";
import CommercialPrivateRoute from "./utils/CommercialPrivateRoute";
import ComAll from "./scenes/commercial/ComAll";
import AgentOpportunities from "./scenes/commercial/opportunities";
import AgentOppDetails from "./scenes/commercial/opportunities/AgentOppDetails";
import SecretaryAll from "./scenes/secretary/SecretaryAll";
import SecretaryPrivateRoute from "./utils/SecretaryPrivateRoute";
import MyProfile from "./scenes/users/MyProfile";
import UpdateProfile from "./scenes/users/UpdateProfile";
import UserDetails from "./scenes/users/UserDetails";
import AgentOffers from "./scenes/commercial/offers";
import OfferDetails from "./scenes/commercial/offers/OfferDetails";
import Offers from "./scenes/offers";
import OfferDet from "./scenes/offers/OfferDet";

function App() {
  const [theme, colorMode] = useMode();
  const { isLoggedIn, roles } = useContext(AuthContext);
  console.log(roles);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" reverseOrder={true} duration="3000" />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute isSignedIn={isLoggedIn}>
                <AllInOne />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            {/* Customers  */}
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetails />} />
            <Route path="customers/update/:id" element={<UpdateCustomer />} />
            {/* Contacts  */}
            <Route path="/contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactDetails />} />
            <Route path="contacts/update/:id" element={<UpdateContact />} />
            {/* Users  */}
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            {/* Opportunities */}
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetails />} />
            <Route path="profile" element={<MyProfile />}>
              <Route path="update" element={<UpdateProfile />} />
            </Route>
            {/* Offers */}
            <Route path="offers" element={<Offers />} />
            <Route path="offers/:id" element={<OfferDet />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/geography" element={<Geography />} />
          </Route>
          <Route
            path="/commercial"
            element={
              <CommercialPrivateRoute isSignedIn={isLoggedIn} role={roles[0]}>
                <ComAll />
              </CommercialPrivateRoute>
            }
          >
            <Route path="opportunities" element={<AgentOpportunities />} />
            <Route path="opportunities/:id" element={<AgentOppDetails />} />
            <Route path="offers" element={<AgentOffers />} />
            <Route path="offers/:id" element={<OfferDetails />} />
            <Route path="profile" element={<MyProfile />}>
              <Route path="update" element={<UpdateProfile />} />
            </Route>
          </Route>
          <Route
            path="/secretary"
            element={
              <SecretaryPrivateRoute isSignedIn={isLoggedIn} role={roles[0]}>
                <SecretaryAll />
              </SecretaryPrivateRoute>
            }
          >
            {/* Customers  */}
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetails />} />
            <Route path="customers/update/:id" element={<UpdateCustomer />} />
            {/* Contacts  */}
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactDetails />} />
            <Route path="contacts/update/:id" element={<UpdateContact />} />
            {/* Opportunities */}
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetails />} />
            <Route path="profile" element={<MyProfile />}>
              <Route path="update" element={<UpdateProfile />} />
            </Route>
          </Route>
          <Route path="/login" element={<SignIn />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
