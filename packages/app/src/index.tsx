import App from "App";
import React from "react";
import ReactDOM from "react-dom";

console.log(`test2:${process.env.NODE_ENV}`);
console.log(`test:${process.env.PUBLIC_URL}`);
console.log(`test1:${process.env.test}`);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

export default App;
