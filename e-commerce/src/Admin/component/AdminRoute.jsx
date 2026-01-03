import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import api from "../../services/api";
import { useEffect, useState } from "react";

function AdminRoute({ children }) {
  // const { user, loading } = useAuth();
  const { loading, isAuthenticated } = useAuth();
  const [checking, setchecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      api
        .get("/dashboard/products/health/")
        .then(() => {
          setAllowed(true);
        })
        .catch(() => {
          setAllowed(false);
        })
        .finally(() => {
          setchecking(false);
        });
    } else if (!loading) {
      setchecking(false);
    }
  }, [loading, isAuthenticated]);

  if (loading || checking) {
    return <div>Checking admin access...</div>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
