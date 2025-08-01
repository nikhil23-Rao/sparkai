"use client";
import React, { useState } from "react";

const SENTENCES = [
  {
    text: "The sun is very _",
    options: ["hot", "bright", "cold", "blue", "far"],
    llm: "hot",
    funFacts: [
      "The sun's surface temperature is about 5,500°C (9,932°F)!",
      "The sun is actually white, but looks yellow from Earth.",
    ],
  },
  {
    text: "Cats love to chase _",
    options: ["mice", "lasers", "dogs", "cars", "shadows"],
    llm: "mice",
    funFacts: [
      "Cats are natural hunters and love chasing small moving things.",
      "Laser pointers are a favorite toy for many cats!",
    ],
  },
  {
    text: "A rainbow has _ colors",
    options: ["seven", "five", "three", "ten", "infinite"],
    llm: "seven",
    funFacts: [
      "The classic rainbow has 7 colors: red, orange, yellow, green, blue, indigo, violet.",
      "Rainbows are caused by sunlight and water droplets.",
    ],
  },
  {
    text: "The capital of France is _",
    options: ["Paris", "London", "Berlin", "Rome", "Madrid"],
    llm: "Paris",
    funFacts: [
      "Paris is known as the 'City of Light'.",
      "The Eiffel Tower is one of the most famous landmarks in Paris.",
    ],
  },
];

function getRandomIndex(max: number, exclude: number) {
  let idx = Math.floor(Math.random() * max);
  while (idx === exclude) {
    idx = Math.floor(Math.random() * max);
  }
  return idx;
}

export default function SentencePredictor() {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [showResult, setShowResult] = useState(false);

  const sentence = SENTENCES[sentenceIdx];

  const handleSelect = (option: string) => {
    setSelected(option);
    setCustom("");
    setShowResult(false);
  };

  const handleCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(null);
    setCustom(e.target.value);
    setShowResult(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  const handleNextSentence = () => {
    setShowResult(false);
    setSelected(null);
    setCustom("");
    setSentenceIdx((prev) => getRandomIndex(SENTENCES.length, prev));
  };

  const userAnswer = selected || (custom.trim() ? custom.trim() : null);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 16px 0 rgba(217,118,86,0.08)",
        padding: 32,
        maxWidth: 480,
        margin: "0 auto",
        marginTop: 32,
      }}
    >
      <h2 style={{ color: "#d97656", marginBottom: 16 }}>Sentence Predictor</h2>
      <div style={{ fontSize: 18, marginBottom: 18 }}>
        Fill in the blank:
        <br />
        <span style={{ fontWeight: 700, fontSize: 22, color: "#222" }}>
          {sentence.text.replace("___", (<u>___</u>) as any)}
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          {sentence.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              style={{
                background: selected === option ? "#eafbe7" : "#fff7f2",
                color: selected === option ? "#2e7d32" : "#d97656",
                border:
                  selected === option
                    ? "2px solid #6ee7b7"
                    : "1.5px solid #ffd7b3",
                borderRadius: 18,
                padding: "8px 18px",
                margin: "0 8px 8px 0",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 18 }}>
          <input
            type="text"
            placeholder="Or write your own word"
            value={custom}
            onChange={handleCustom}
            style={{
              border: "1.5px solid #ffd7b3",
              borderRadius: 12,
              padding: "8px 14px",
              fontSize: 16,
              width: "70%",
              marginRight: 10,
            }}
            maxLength={20}
          />
        </div>
        <button
          type="submit"
          style={{
            background: "#d97656",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "10px 32px",
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 8,
            boxShadow: "0 2px 8px 0 rgba(217,118,86,0.08)",
          }}
          disabled={!userAnswer}
        >
          See Model Prediction
        </button>
      </form>
      {showResult && (
        <div
          style={{
            marginTop: 22,
            background: "#f7fafd",
            borderRadius: 12,
            padding: 18,
            fontSize: 17,
            color: "#222",
            minHeight: 48,
            border: "1.5px solid #e3edfa",
          }}
        >
          <div>
            <b>Your answer:</b>{" "}
            <span style={{ color: "#d97656" }}>{userAnswer}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <b>Model prediction:</b>{" "}
            <span style={{ color: "#2e7d32" }}>{sentence.llm}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 15, color: "#888" }}>
            {userAnswer?.toLowerCase() === sentence.llm.toLowerCase()
              ? "🎉 You matched the model! Most likely word: " + sentence.llm
              : `You chose a different word. The model predicts "${sentence.llm}" as most likely.`}
          </div>
          <div style={{ marginTop: 16, fontSize: 15, color: "#888" }}>
            <b>Fun fact:</b>{" "}
            {
              sentence.funFacts[
                Math.floor(Math.random() * sentence.funFacts.length)
              ]
            }
          </div>
          <button
            onClick={handleNextSentence}
            style={{
              marginTop: 18,
              background: "#fff7f2",
              color: "#d97656",
              border: "1.5px solid #ffd7b3",
              borderRadius: 18,
              padding: "8px 22px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              transition: "all 0.15s",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Try Another Sentence
          </button>
        </div>
      )}
      <div style={{ marginTop: 28, color: "#888", fontSize: 15 }}>
        <b>Why?</b> Language models predict the next word one token at a time,
        based on probability from their training data.
      </div>
    </div>
  );
}
