import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import Departments from "../components/Departments";
import MessageForm from "../components/MessageForm";

const Home = () => {
  return (
    <>
      <Hero title={
        "Welcome to Lilypad Community Hospital | Your Trusted Healthcare Partners!"
        } 
        imageUrl={"/heroo.png"}
      />
      <Biography imageUrl={"/about.png"}/>
      <Departments/>
      <MessageForm/>
    </>   
  ); 
};

export default Home;