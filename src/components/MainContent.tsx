import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import React from "react";
import { MailList } from "./MailList";

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
export const MainContent = () => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        {/* <ProfileContent /> */}
        <MailList />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5 className="card-title">
          Please sign-in to with your email address.
        </h5>
      </UnauthenticatedTemplate>
    </div>
  );
};
