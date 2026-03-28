import { useState } from "react";

function App() {

  const [reactColor, setReactColor] = useState("lightblue");

  function changeHtmlColor() {
    const input = document.getElementById("htmlInput");
    const box = document.getElementById("htmlColorBox");
    const val = input.value.trim();
    if (!val) return;
    box.style.backgroundColor = val;
    input.value = "";
  }

  function changeReactColor() {
    const input = document.getElementById("reactInput");
    const val = input.value.trim();
    if (!val) return;
    setReactColor(val);
    input.value = "";
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>

      <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>

        <div>
          <h2>Part 1: HTML DOM</h2>
          <div
            id="htmlColorBox"
            style={{ width: 150, height: 150, backgroundColor: "lightgray", border: "1px solid #ccc", borderRadius: 8 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input id="htmlInput" type="text" placeholder="Enter color (e.g., red, #ff0000)" />
            <button onClick={changeHtmlColor}>Change Color (HTML DOM)</button>
          </div>
        </div>

        <div>
          <h2>Part 2: React DOM</h2>
          <div
            style={{ width: 150, height: 150, backgroundColor: reactColor, border: "1px solid #ccc", borderRadius: 8 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input id="reactInput" type="text" placeholder="Enter color (e.g., blue, #0000ff)" />
            <button onClick={changeReactColor}>Change Color (React DOM)</button>
          </div>
        </div>

      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Comparison</h2>
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>HTML DOM Approach</th>
              <th>React DOM Approach</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>How does it update the UI?</td>
              <td>Directly sets element.style — imperative</td>
              <td>Calls setState, triggers re-render — declarative</td>
            </tr>
            <tr>
              <td>Does it touch the DOM directly?</td>
              <td>Yes — getElementById grabs the real DOM node</td>
              <td>No — React diffs the virtual DOM first</td>
            </tr>
            <tr>
              <td>What happens on re-render?</td>
              <td>Change is lost — React is unaware of it</td>
              <td>Color persists — state drives the UI</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;