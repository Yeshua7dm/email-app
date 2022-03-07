import * as React from "react";
import { PageLayout } from "./components/PageLayout";
import { MainContent } from "./components/MainContent";
import "./styles/App.css";

export default function App() {
  return (
    <PageLayout>
      <MainContent />
      <footer className="text-center pt-5 mb-3">
        <div>
          <a href="https://github.com/yeshua7dm">
            <span>&copy; Joshua Oke</span>
          </a>
        </div>
      </footer>
    </PageLayout>
  );
}
