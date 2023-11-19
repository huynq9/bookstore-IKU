import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  const { user, isAuthenticated, isLoading , error} = useAuth0();
 console.log(error);
  if (isLoading) {
    return <div>Loading ...</div>;
  }
 console.log(isAuthenticated);
  return (
    isAuthenticated && (
      <div>
        {JSON.stringify(user, null, 2)}
      </div>
    )
  );
};

export default Profile;