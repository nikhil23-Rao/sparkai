"use client";
import { useParams } from "next/navigation";
import { content } from "../../../data/content";
import styles from "../../main/main.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faLightbulb,
  faCogs,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import PromptTuner from "@/app/components/PromptTuner";
import SentencePredictor from "@/app/components/SentencePredictor";

import AITruthTest from "@/app/components/GuessActivity";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function VideoPage() {
  const [watchedSlug, setWatchedSlug] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: "Hey! Let me know if you need help with anything",
    } as any,
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const videoName = params?.video_name as string;

  useEffect(() => {
    if (typeof window.localStorage !== "undefined") {
      setWatchedSlug(localStorage.getItem("lastvideowatched")!);
    }
  }, [typeof window]);

  // // Scroll to bottom on new message
  // useEffect(() => {
  //   if (chatEndRef.current)
  //     chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  // }, [chatMessages]);

  // Find the content item by slugified title
  const item = content.find(
    (c) =>
      c.videoTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") === videoName
  );

  // Group content by module (same as main page)
  const modules = content.reduce((acc, item, idx) => {
    if (!acc[item.module]) acc[item.module] = [];
    acc[item.module].push({ ...item, idx });
    return acc;
  }, {} as Record<number, any[]>);

  // Icon selection for sidebar (same as main page)
  const getSidebarIcon = (item: any) => {
    if (item.type === "video") return faVideo;
    if (item.type === "activity") return faLightbulb;
    if (item.type === "project") return faCogs;
    return faBookOpen;
  };

  // Gemini API call
  async function sendToGemini(
    updatedMessages: { role: "user" | "assistant"; content: string }[]
  ) {
    console.log("API KEY:", process.env.NEXT_PUBLIC_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY!);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

      // Prepare the context by including the system prompt as the first assistant message
      const context = [
        {
          role: "assistant",
          parts: [
            {
              text: `You are an assistant that provides assistance to elementary and middle school students
               based on the following video transcript. You help give quizzes, visualizations, examples, etc. on the current topic. You are extremely nice, and conversational. You act like a teacher. This is an Intro TO AI course. You are an AI assistant/teacher of the site.
            
              Return all your answers with markdown, and also keep your answers VERY SHORT, and bullet points mostly. For Quizzes and make it nicely formatted in markdown (choices: A, B, C, D); Give space between each question and also give a NEW line for each answer choice. For multiple choice questions, give each answer choice in its own new line.

               video transcript: ${item?.transcript}
               
              `,
            },
          ],
        },
        ...updatedMessages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
      ];

      const result = await model.generateContent({ contents: context } as any);

      const text = result.response.candidates
        ? result.response.candidates[0].content.parts[0].text
        : "Sorry, I couldn't generate a response.";
      console.log("TEXT", text);
      setChatMessages(
        (msgs) => [...msgs, { role: "assistant", content: text }] as any
      );
    } catch (error) {
      console.log("Something Went Wrong");
      console.log(error);
      setChatMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "Sorry, there was an error." },
      ]);
    }
  }

  // Handle chat submit
  async function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    const updatedMessages = [...chatMessages, userMsg]; // Include the latest user message
    setChatMessages(updatedMessages as any);
    setLoading(true);
    try {
      await sendToGemini(updatedMessages as any); // Pass the updated messages to the function
    } catch (err) {
      setChatMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "Sorry, there was an error." },
      ]);
    }
    setChatInput("");
    setLoading(false);
  }

  // Find the index of the current item in the content array
  const currentIdx = content.findIndex(
    (c) =>
      c.videoTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") === videoName
  );
  const nextItem = content[currentIdx + 1];
  const watchedIdx = content.findIndex(
    (c) =>
      c.videoTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") === watchedSlug
  );

  return (
    <div className={styles.mainLayout}>
      <aside className={styles.sidebarLeft}>
        <Link href={"/main"} className={styles.sidebarTitle}>
          {" "}
          {"<"} Back
        </Link>
        <nav className={styles.moduleNav}>
          {Object.entries(modules).map(([moduleNum, items]) => (
            <div className={styles.moduleSection} key={moduleNum}>
              <div className={styles.moduleHeader}>{`MODULE ${moduleNum}`}</div>
              <ul
                className={styles.moduleList}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                {items.map((sidebarItem, i) => {
                  const slug = sidebarItem.videoTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  const isActive = slug === videoName;
                  // Highlight as watched if slug is <= lastvideowatched in content order

                  // Find index in flat content array
                  const flatIdx = content.findIndex(
                    (c) =>
                      c.videoTitle
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "") === slug
                  );
                  const watchedIdx = content.findIndex(
                    (c) =>
                      c.videoTitle
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "") === watchedSlug
                  );
                  const isWatched =
                    watchedSlug &&
                    watchedIdx !== -1 &&
                    flatIdx !== -1 &&
                    flatIdx <= watchedIdx;

                  return (
                    <li key={sidebarItem.videoTitle} style={{ padding: 7 }}>
                      <a
                        className={[
                          styles.moduleLink,
                          isActive ? styles.activeModuleLink : "",
                          isWatched ? styles.watchedModuleLink : "",
                        ].join(" ")}
                        style={{ padding: 10 }}
                        href={`/video/${encodeURIComponent(slug)}`}
                      >
                        <FontAwesomeIcon
                          style={{
                            width: 20,
                            color: isWatched ? "#2e7d32" : undefined,
                          }}
                          icon={getSidebarIcon(sidebarItem)}
                          className={styles.moduleIcon}
                        />
                        {sidebarItem.videoTitle}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main
        className={styles.introScreen}
        style={{ overflowY: "scroll", height: "100vh", position: "relative" }}
      >
        {item ? (
          <div
            style={{
              padding: 40,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            {/* Next button */}
            {(() => {
              // Find the index of the current item in the content array
              const currentIdx = content.findIndex(
                (c) =>
                  c.videoTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "") === videoName
              );
              const nextItem = content[currentIdx + 1];
              const watchedIdx = content.findIndex(
                (c) =>
                  c.videoTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "") === watchedSlug
              );
              if (nextItem) {
                const nextSlug = nextItem.videoTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                // Only update localStorage if currentIdx >= watchedIdx
                return (
                  <Link
                    onClick={() => {
                      if (watchedIdx === -1 || currentIdx >= watchedIdx) {
                        localStorage.setItem(
                          "lastvideowatched",
                          content[currentIdx].videoTitle
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")
                        );
                      }
                    }}
                    href={`/video/${encodeURIComponent(nextSlug)}`}
                    className={styles.nextButton}
                    style={{
                      position: "absolute",
                      top: 25,
                      right: 34,
                      zIndex: 2,
                      textDecoration: "none",
                    }}
                  >
                    Next &rarr;
                  </Link>
                );
              }
              return null;
            })()}
            <h1 style={{ fontSize: 32, marginBottom: 24, textAlign: "center" }}>
              {item.videoTitle}
            </h1>
            <div
              style={{
                fontSize: 18,
                color: "#b08b7a",
                marginBottom: 8,
                marginTop: 24,
                textAlign: "center",
              }}
            >
              Module {item.module} &middot; {item.type}
            </div>
            {item.audience && (
              <div
                style={{ fontSize: 16, marginBottom: 8, textAlign: "center" }}
              >
                <b>Audience:</b> {item.audience}
              </div>
            )}

            {item.objective && (
              <div
                style={{ fontSize: 16, marginBottom: 8, textAlign: "center" }}
              >
                <b>Objective:</b> {item.objective}
              </div>
            )}

            {item.type === "activity" && (
              <div
                style={{
                  margin: "32px 0",
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: "0 2px 12px 0 rgba(217, 118, 86, 0.07)",
                }}
              >
                {/* <ReactMarkdown>{item.markdown}</ReactMarkdown> */}
                {item.module == 1 ? (
                  <div className="markdown-content">
                    <ReactMarkdown>{item.markdown}</ReactMarkdown>
                  </div>
                ) : item.module == 2 ? (
                  <SentencePredictor></SentencePredictor>
                ) : item.module == 4 ? (
                  <AITruthTest></AITruthTest>
                ) : item.module == 3 ? (
                  <PromptTuner></PromptTuner>
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>{item.markdown}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
            {item.type === "video" && (
              <div className={styles.videoPlayerWrapper}>
                <video
                  className={styles.videoPlayer}
                  src={item.url}
                  controls
                  poster="/video-poster.png"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: 40, fontSize: 24 }}>Video not found.</div>
        )}
      </main>
      <aside className={styles.sidebarRight}>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            height: 400,
          }}
        >
          <img
            src="/logo.png"
            style={{
              width: 140,
              border: "2px solid #FEE6D4",
              borderRadius: 100,
            }}
            alt=""
          />
          <h1 style={{ marginTop: 20 }}>Spark AI Assistant</h1>
          <p style={{ color: "gray", maxWidth: "70%", textAlign: "center" }}>
            Ask Spark anything about this topic, or try a suggested prompt!
          </p>
          <div className={styles.suggestedBubbles}>
            <button
              className={styles.suggestedBubble}
              onClick={() => setChatInput("Help me visualize this")}
            >
              Help me visualize this
            </button>
            <button
              className={styles.suggestedBubble}
              onClick={() => setChatInput("Give me a quiz on this")}
            >
              Give me a quiz on this
            </button>
            <button
              className={styles.suggestedBubble}
              onClick={() => setChatInput("Summarize the key points")}
            >
              Summarize the key points
            </button>
          </div>
        </div>
        <div
          className={styles.chatboxContainer}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            boxShadow: "none",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div className={styles.chatboxMessages} style={{ width: "100%" }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={
                  "markdown-content " + msg.role === "user"
                    ? styles.chatMessage
                    : [styles.chatMessage, styles.chatMessageAI].join(" ")
                }
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#fbeee7" : "#e8f0fa",
                  color: msg.role === "user" ? "#c56548" : "#2563eb",
                  padding: 15,
                }}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            className={styles.chatboxInputRow}
            style={{ width: "100%" }}
            onSubmit={handleChatSubmit}
          >
            <input
              className={styles.chatboxInput}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
            />
            <button
              className={styles.chatboxSend}
              type="submit"
              disabled={loading || !chatInput.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
