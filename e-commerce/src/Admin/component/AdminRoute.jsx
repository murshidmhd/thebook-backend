import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import api from "../../services/api";
import { useEffect, useState } from "react";

function AdminRoute({ children }) {
  // const { user, loading } = useAuth();
  const { loading } = useAuth();
  const [checking, setchecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!loading) {
      api
        .get("/dashboard/products/health/")
        .then(() => {
          setAllowed(true);
          console.log("allowed aan");
        })
        .catch((err) => {
          setAllowed(false);
          console.log("allowed alla", err.response?.status);
        })
        .finally(() => {
          setchecking(false);
        });
    } else if (loading) {
      setchecking(false);
      setAllowed(false);
    }
  }, [loading]);

  if (loading || checking) {
    return <div>Checking admin access...</div>;
  }

  if (!allowed) {
    console.log("not allowed navigate login page");

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
