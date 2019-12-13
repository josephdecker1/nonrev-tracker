import React from "react";

const Home = props => {
  return (
    <>
      <h1>hello! Home page</h1>
      {Object.entries(props.user).map(key => {
        console.log(key);
        return (
          <div key={key}>
            {key[0].toString()} :: {key[1] ? key[1].toString() : "--"}
          </div>
        );
      })}
    </>
  );
};

export default Home;
