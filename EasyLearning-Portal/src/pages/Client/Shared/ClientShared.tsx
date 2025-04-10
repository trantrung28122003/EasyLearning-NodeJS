import React, { ReactNode } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
interface ClientProps {
  children: ReactNode;
}

const ClientShared: React.FC<ClientProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default ClientShared;
