import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar.js";
import VerticalNavbar from "./components/VerticalNavbar";
import SentimentAnalysis from "../src/components/SentimentAnalysis";
import Summarization from "../src/components/Summarization";
import Translation from "../src/components/Translation";
import QuestionAnswering from "../src/components/QuestionAnswering";
import TextGeneration from "../src/components/TextGeneration";
import SentenceSimilarity from "../src/components/SentenceSimilarity";
import FillMask from "../src/components/FillMask";
import ImageClassification from "../src/components/ImageClassification";
import ObjectDetection from "../src/components/ObjectDetection";
import Segmentation from "../src/components/Segmentation";


function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <VerticalNavbar />
        <Routes>
          <Route path="/" element={<SentimentAnalysis />} />
          <Route path="/text-summarization" element={<Summarization />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/question-answering" element={<QuestionAnswering />} />
          <Route path="/text-generation" element={<TextGeneration />} />
          <Route path="/sentence-similarity" element={<SentenceSimilarity />} />
          <Route path="/fill-mask" element={<FillMask />} />
          <Route
            path="/image-classification"
            element={<ImageClassification />}
          />
          <Route path="/object-detection" element={<ObjectDetection />} />
          <Route path="/segmentation" element={<Segmentation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
