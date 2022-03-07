import * as React from "react";
import { PageLayout } from "./components/PageLayout";
import { MainContent } from "./components/MainContent";
import "./styles/App.css";

export default function App() {
  return (
    <PageLayout>
      <MainContent />
    </PageLayout>
  );
}
