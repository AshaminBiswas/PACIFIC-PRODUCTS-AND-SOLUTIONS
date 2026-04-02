import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <RouterProvider router={router} />
    </div>
  );
}

