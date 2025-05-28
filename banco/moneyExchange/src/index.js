import React from "react";
import { createRoot } from "react-dom/client";
import ExchangeTool from "./components/ExchangeTool";


const container = document.getElementById("root");
const root = createRoot(container);

root.render(<ExchangeTool />);
