export const colors = {
  white: "#FFFFFF",
  blue: "#304CB2",
  red: "#D5152E",
  yellow: "#FFBF27",
  deepSilver: "#5E7E95",
  turquoise: "#00A9E0",
  green: "#008522",
  orange: "#FF792E",
  black: "#000000",
  midnightBlue: "#111B40",
  darkBlue: "#1A2C80"
};

export const mapContainer = `
  height: 95%;
  display: flex;
  margin-top: 15px;
  padding: 10px;
  flex-direction: column;
}`;

export const mainContent = `
width: 100vw;
height: 70vh;
flex-direction: column;
`;

export const flightStats = `
  height: 5%;
  width: 100%;

`;

export const gridStyles = `
  height: 100%;
  align-items: center;
  text-align: center;
`;

export const gridStylesPaper = `
  align-items: center;
  justify-content: center;
  background-color: ${colors.green};
  height: 100%;
`;

export const flightStatsContent = `
  background-color: ${colors.darkBlue};
`;

export const flightsContainer = `
  height: 25vh;
  color: ${colors.deepSilver};
  font-weight: bold;
  background-color: ${colors.blue};
`;

export const uploadButton = `
  color: ${colors.black};
  background-color: ${colors.yellow}; 
  &:hover { 
    color: ${colors.deepSilver}; 
    background-color: ${colors.midnightBlue}
  }

  label {
    height: 100%;
    width: 100%;
    border-radius: 5px;
    padding: 5px;
  }

  padding: 1px;
`;

export const uploadFormInput = `
  opacity: 0;
  position: absolute;
  pointer-events: none;
  width: 1px;
  height: 1px;
`;

export const mapMarkerStyle = `
  position: absolute;
  height: 20px;
  width: 20px;
  transform: translate(-50%, -50%);
`;

export const iconStyle = `
  height: 100%;
  width: 100%;
  fill: ${colors.blue};
`;
