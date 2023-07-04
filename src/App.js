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

function App() {
  const [theme, colorMode] = useMode();
  const { isLoggedIn } = useContext(AuthContext);
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
            {/* <Route path="users/:id" element={<CustomerDetails />} /> */}
            {/* Opportunities */}
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/geography" element={<Geography />} />
          </Route>
          <Route path="/login" element={<SignIn />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
