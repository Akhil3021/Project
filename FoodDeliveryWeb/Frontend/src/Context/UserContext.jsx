import axios from "axios";
import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios
        .get("http://localhost:5083/api/Account/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          setUser(data);
          Cookies.set("user_id", data.userId);
          console.log("User-side:", data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          if (error.response && error.response.status === 401) {
            setUser(null);
            Cookies.remove("token");
          }
        })
        .finally(() => {
          setLoading(false); // Set loading to false once request is done
        });
    } else {
      setLoading(false); // If no token, set loading to false
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
