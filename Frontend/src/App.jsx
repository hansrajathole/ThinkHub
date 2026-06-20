import React, { useEffect } from "react";
import AppRouter from "./Routes/Router";
import { Toaster } from "react-hot-toast";
import "remixicon/fonts/remixicon.css";
import { setupAxiosInterceptors } from "./config/axios";

const App = () => {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <div className="">
      <AppRouter />
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
