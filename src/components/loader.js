import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const Loading = () => {
  return (
    <div>
      <Dimmer active>
        <Loader />
      </Dimmer>
    </div>
  );
};

export default Loading;
