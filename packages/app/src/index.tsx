import React from "react";
import ReactDOM from "react-dom";
import test2 from "test2";
import "./index.css";
import f from "./test.jpeg";

console.log(`test2:${process.env.NODE_ENV}`);
console.log(`test:${process.env.PUBLIC_URL}`);
console.log(`test1:${process.env.test}`);

function App() {
  test2();
  return (
    <div className="test-css">
      App
      <img src={f} alt="test" />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

export default App;
