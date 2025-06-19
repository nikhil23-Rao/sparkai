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

export default function VideoPage() {
  const params = useParams();
  const videoName = params?.video_name as string;

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
                  return (
                    <li key={sidebarItem.videoTitle} style={{ padding: 7 }}>
                      <a
                        className={
                          isActive
                            ? `${styles.moduleLink} ${styles.activeModuleLink}`
                            : styles.moduleLink
                        }
                        href={`/video/${encodeURIComponent(slug)}`}
                      >
                        <FontAwesomeIcon
                          style={{ width: 20 }}
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
              if (nextItem) {
                const nextSlug = nextItem.videoTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                return (
                  <Link
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
            {item.duration && (
              <div
                style={{ fontSize: 16, marginBottom: 8, textAlign: "center" }}
              >
                <b>Duration:</b> {item.duration}
              </div>
            )}
            {item.objective && (
              <div
                style={{ fontSize: 16, marginBottom: 8, textAlign: "center" }}
              >
                <b>Objective:</b> {item.objective}
              </div>
            )}
            <div className={styles.videoPlayerWrapper}>
              <video
                className={styles.videoPlayer}
                src="/testscreenrecord.mp4"
                controls
                poster="/video-poster.png"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <div style={{ padding: 40, fontSize: 24 }}>Video not found.</div>
        )}
      </main>
      <aside className={styles.sidebarRight}>
        <img
          src="/logo.png"
          style={{ width: 140, border: "2px solid #FEE6D4", borderRadius: 100 }}
          alt=""
        />
        <h1 style={{ marginTop: 20 }}>Hey, Nikhil!</h1>
        <p style={{ color: "gray", maxWidth: "70%", textAlign: "center" }}>
          let me know if you need help on this topic.
        </p>
        <div className={styles.suggestedBubbles}>
          <button className={styles.suggestedBubble}>
            Help me visualize this
          </button>
          <button className={styles.suggestedBubble}>
            Give me a quiz on this
          </button>
          <button className={styles.suggestedBubble}>
            Summarize the key points
          </button>
        </div>
        <div
          className={styles.chatboxContainer}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            boxShadow: "none",
          }}
        >
          <form>
            <button className={styles.chatboxSend} type="submit">
              Open New Chat
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
