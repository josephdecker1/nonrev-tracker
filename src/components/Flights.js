import React, { useState } from "react";


const renderFlight = () => {
  return (
    <div className="flight">

    </div>
  );
}

export const CenteredGrid = () => {

  return (
    <div className="flight-table">
      { renderFlight() }
    </div>
  );
}