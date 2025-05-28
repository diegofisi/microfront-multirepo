import React, { useEffect, useRef, useState } from "react";

const AngularLoginWrapper = ({ onLoginSuccess }) => {
  const [isLoginMicrofrontendAvailable, setIsLoginMicrofrontendAvailable] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    const checkMicrofrontend = async () => {
      try {
        const response = await fetch("http://localhost:3003/", {
          method: "HEAD",
        });

        if (response.ok) {
          setIsLoginMicrofrontendAvailable(true);
        }
      } catch (error) {
        console.error(
          "Error checking microfrontend availability:",
          error.message
        );
        setIsLoginMicrofrontendAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMicrofrontend();

    const handleMessage = (event) => {
      if (event.origin === "http://localhost:3003") {
        if (event.data.type === "LOGIN_SUCCESS") {
          onLoginSuccess && onLoginSuccess(event.data.user);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLoginSuccess]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isLoginMicrofrontendAvailable) {
    return <div>Login microfrontend is not available.</div>;
  }

  return (
    <div>
      <iframe
        ref={iframeRef}
        src="http://localhost:3003"
        title="Login"
        style={{ width: "100%", height: "100vh", border: "none" }}
      />
    </div>
  );
};
export default AngularLoginWrapper;
