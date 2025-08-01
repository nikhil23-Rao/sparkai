"use client";
import React, { useState } from "react";

const EXAMPLES = [
  "Write a short story about a robot and a cat.",
  "Tell me a joke about pizza.",
  "Explain photosynthesis in one sentence.",
];

function getRandomOutput(prompt: string, temperature: number) {
  // Simulate LLM randomness: higher temperature = more random output
  // Pick a style based on temperature
  let style: "straight" | "poem" | "silly" | "rap" | "detailed" | "short";
  if (temperature < 0.2) style = "straight";
  else if (temperature < 0.4)
    style = Math.random() < 0.5 ? "straight" : "detailed";
  else if (temperature < 0.6)
    style = ["straight", "detailed", "poem"][
      Math.floor(Math.random() * 3)
    ] as any;
  else if (temperature < 0.8)
    style = ["poem", "silly", "short"][Math.floor(Math.random() * 3)] as any;
  else
    style = ["poem", "silly", "rap", "short"][
      Math.floor(Math.random() * 4)
    ] as any;

  switch (style) {
    case "straight":
      return `Here's a straightforward answer to your prompt:\n\n${
        prompt === EXAMPLES[0]
          ? "Once upon a time, a robot and a cat became best friends and explored the world together."
          : prompt === EXAMPLES[1]
          ? "Why did the pizza go to the party? Because it knew how to slice up the dance floor!"
          : prompt === EXAMPLES[2]
          ? "Photosynthesis is how plants turn sunlight into food."
          : "This is a direct answer."
      }`;
    case "poem":
      return `Here's your prompt as a poem:\n\n${
        prompt === EXAMPLES[0]
          ? "A robot met a clever cat,\nIn a world both wide and flat.\nThey shared adventures, big and small,\nAnd proved that friends can conquer all."
          : prompt === EXAMPLES[1]
          ? "Pizza round and cheesy bright,\nTells a joke by oven light.\nWith pepperoni, crust, and cheese,\nIt brings a laugh with tasty ease."
          : prompt === EXAMPLES[2]
          ? "Green leaves reach for the sun,\nTurning light to food, job well done."
          : "A poem for your prompt:\nWords that dance and gently romp."
      }`;
    case "silly":
      return `A silly response:\n\n${
        prompt === EXAMPLES[0]
          ? "The robot tried to purr, the cat tried to beep, and together they invented the world's first meow-bot!"
          : prompt === EXAMPLES[1]
          ? "Why did the pizza cross the road? To get to the other slice!"
          : prompt === EXAMPLES[2]
          ? "Photosynthesis is when plants eat sunlight for breakfast, lunch, and dinner!"
          : "A silly twist on your prompt!"
      }`;
    case "rap":
      return `Here's your prompt as a rap:\n\n${
        prompt === EXAMPLES[0]
          ? "Yo, a robot and a cat, on the scene,\nRolling through the city, keeping it clean.\nMetal and fur, what a crazy team,\nLiving out loud, chasing every dream!"
          : prompt === EXAMPLES[1]
          ? "Pizza in the oven, cheese on the top,\nTell me a joke, and I just can't stop.\nSlice it up, serve it hot,\nPizza party, give it all you got!"
          : prompt === EXAMPLES[2]
          ? "Sunshine hits the leaf, you know what I mean,\nTurns into food, keeps the plant real green!"
          : "Rap style: dropping lines for your prompt!"
      }`;
    case "detailed":
      return `A detailed explanation:\n\n${
        prompt === EXAMPLES[0]
          ? "Robots are machines that can be programmed to perform tasks. Cats are animals known for their curiosity. In a story, a robot and a cat could learn from each other, combining logic and intuition to solve problems and go on adventures."
          : prompt === EXAMPLES[1]
          ? "Pizza is a popular Italian dish. Jokes about pizza often play on words related to toppings, slices, or delivery. For example: 'What type of person doesn’t like pizza? A weir-dough.'"
          : prompt === EXAMPLES[2]
          ? "Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water. It generally involves the green pigment chlorophyll and generates oxygen as a byproduct."
          : "A detailed answer for your prompt."
      }`;
    case "short":
      return `A super short answer:\n\n${
        prompt === EXAMPLES[0]
          ? "Robot + cat = fun pals."
          : prompt === EXAMPLES[1]
          ? "Pizza jokes are cheesy!"
          : prompt === EXAMPLES[2]
          ? "Plants eat sunlight."
          : "Short answer!"
      }`;
    default:
      return "LLM output here!";
  }
}

export default function PromptTuner() {
  const [prompt, setPrompt] = useState(EXAMPLES[0]);
  const [temperature, setTemperature] = useState(0.5);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = () => {
    setOutput(getRandomOutput(prompt, temperature));
  };

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
      <h2 style={{ marginBottom: 16, color: "#d97656" }}>Prompt Tuner Game</h2>
      <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
        Prompt:
      </label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          borderRadius: 8,
          border: "1.5px solid #f0e0d7",
          padding: 10,
          fontSize: 16,
          marginBottom: 12,
          resize: "vertical",
        }}
      />
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>Temperature: </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          style={{ width: 180, verticalAlign: "middle", margin: "0 10px" }}
        />
        <span
          style={{
            display: "inline-block",
            minWidth: 32,
            color: "#d97656",
            fontWeight: 700,
          }}
        >
          {temperature}
        </span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>Examples: </span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            style={{
              margin: "0 6px 6px 0",
              background: "#fff7f2",
              border: "1px solid #ffd7b3",
              borderRadius: 12,
              padding: "4px 10px",
              cursor: "pointer",
              color: "#d97656",
              fontWeight: 500,
              fontSize: 14,
            }}
            onClick={() => setPrompt(ex)}
            type="button"
          >
            {ex}
          </button>
        ))}
      </div>
      <button
        onClick={handleRun}
        style={{
          background: "#d97656",
          color: "#fff",
          border: "none",
          borderRadius: 20,
          padding: "10px 32px",
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: 18,
          marginTop: 8,
          boxShadow: "0 2px 8px 0 rgba(217,118,86,0.08)",
        }}
      >
        Run
      </button>
      {output && (
        <div
          style={{
            marginTop: 18,
            background: "#f7fafd",
            borderRadius: 12,
            padding: 18,
            fontSize: 17,
            color: "#222",
            minHeight: 48,
            border: "1.5px solid #e3edfa",
          }}
        >
          <b>LLM Output:</b>
          <div style={{ marginTop: 8 }}>{output}</div>
        </div>
      )}
    </div>
  );
}
