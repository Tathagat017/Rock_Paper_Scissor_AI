import { useState } from "react";

const Navbar = () => {
  return (
    <nav style={{ marginBottom: "2%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: "#282c34",
          color: "whitesmoke",
          fontFamily: "cursive",
          fontSmooth: true,
          fontWeight: "1rem",
          marginBottom: "-1%",
          boxshadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <div style={{ width: "13%" }}>
          <img src="Logo.png" style={{ width: "90%" }}></img>
        </div>
        <marquee
          style={{
            lineHeight: "1.3",
            fontFamily: "sans-serif",
            whiteSpace: "nowrap",
            animation: "marquee 3.5s infinite linear",
          }}
        >
          <div
            style={{
              justifyContent: "space-between",
              width: "100%",
              color: "aliceblue",
              fontFamily: "sans-serif",
              fontSmooth: true,
              fontWeight: "100",
              textShadow: "revert-layer",
            }}
          >
            <h1>{["🪨Rock", "📃Paper", "✂️Scissor"].join("   ")}</h1>
          </div>
        </marquee>
      </div>
    </nav>
  );
};

export default Navbar;
