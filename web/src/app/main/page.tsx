"use client";
import styles from "../main/main.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faLightbulb,
  faCogs,
  faComments,
  faRobot,
  faVideo,
  faMedal,
  faCircle as faCircleSolid,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleRegular } from "@fortawesome/free-regular-svg-icons";
import { content } from "../../data/content";
import { createAvatar } from "@dicebear/core";
import { bigEars } from "@dicebear/collection";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const [url, setUrl] = useState("");
  const [watchedSlug, setWatchedSlug] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [profileName, setProfileName] = useState("Learner");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("avatar")) {
      const avatar = createAvatar(bigEars, {
        seed: Math.random() * 100 + "hey",
        // ... options
      });
      setUrl(avatar.toDataUri());
      localStorage.setItem("avatar", avatar.toDataUri());
    } else {
      setUrl(localStorage.getItem("avatar")!);
    }
  }, []);
  useEffect(() => {
    if (typeof window.localStorage !== "undefined") {
      setWatchedSlug(localStorage.getItem("lastvideowatched")!);
      if (
        localStorage.getItem("profilename") &&
        localStorage.getItem("profilename")!.length > 0
      ) {
        setProfileName(localStorage.getItem("profilename")!);
      }
    }
  }, [typeof window]);
  // Example watched state for each video (replace with real data as needed)
  // const watched = [true, false, true, false, false];

  // Group content by module
  const modules = content.reduce((acc, item, idx) => {
    if (!acc[item.module]) acc[item.module] = [];
    acc[item.module].push({ ...item, idx });
    return acc;
  }, {} as Record<number, any[]>);

  // Icon selection for sidebar (customize as needed)
  const getSidebarIcon = (item: any) => {
    if (item.type === "video") return faVideo;
    if (item.type === "activity") return faLightbulb;
    if (item.type === "project") return faCogs;
    return faBookOpen;
  };

  // Calculate videos watched based on watchedSlug
  const watchedIdx = content.findIndex(
    (c) =>
      c.videoTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") === watchedSlug
  );
  const videosWatched =
    watchedIdx === -1
      ? 0
      : content.slice(0, watchedIdx + 1).filter((c) => c.type === "video")
          .length;

  return (
    <div className={styles.mainLayout}>
      <aside className={styles.sidebarLeft}>
        <div className={styles.sidebarTitle}>Course Navigation</div>
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
                {items.map((item, i) => {
                  const slug = item.videoTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
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
                    <li key={item.videoTitle} style={{ padding: 7 }}>
                      <button
                        className={[
                          styles.moduleLink,
                          isWatched ? styles.watchedModuleLink : "",
                        ].join(" ")}
                        style={{
                          background: "none",
                          border: "none",
                          width: "100%",
                          textAlign: "left",
                          cursor: "pointer",
                          padding: 10,
                        }}
                        onClick={() =>
                          router.push(`/video/${encodeURIComponent(slug)}`)
                        }
                      >
                        <FontAwesomeIcon
                          style={{
                            width: 20,
                            color: isWatched ? "#2e7d32" : undefined,
                          }}
                          icon={getSidebarIcon(item)}
                          className={styles.moduleIcon}
                        />
                        {item.videoTitle}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        {/* ...add navigation or course list here... */}
      </aside>
      <main
        className={styles.introScreen}
        style={{ overflowY: "scroll", height: "100vh" }}
      >
        <div className={styles.searchBarWrapper}></div>
        <div className={styles.banner}>
          <div className={styles.bannerWave}></div>
          <div className={styles.bannerText}>
            Welcome back, {profileName.split(" ")[0]}!
          </div>
          <div className={styles.bannerSubtext}>
            Ready to continue your AI journey? Explore new lessons, projects,
            and achievements below.
          </div>
        </div>
        <div className={styles.mainContentRow}>
          <section className={styles.continueSection}>
            <h2 className={styles.continueTitle}>
              Continue where you left off
            </h2>
            <div className={styles.continueCard}>
              <div>
                <div className={styles.lessonTitle}>
                  {
                    // Show the next unwatched video, or "All videos complete!" if done
                    (() => {
                      const watchedIdx = content.findIndex(
                        (c) =>
                          c.videoTitle
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "") === watchedSlug
                      );
                      const nextVideo = content
                        .slice(watchedIdx + 1)
                        .find((c) => c.type === "video");
                      if (nextVideo) {
                        return `Module ${nextVideo.module}: ${nextVideo.videoTitle}`;
                      }
                      // If all videos watched, show a message
                      return "All videos complete!";
                    })()
                  }
                </div>
                {/* Progress text removed */}
              </div>
              {(() => {
                const watchedIdx = content.findIndex(
                  (c) =>
                    c.videoTitle
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "") === watchedSlug
                );
                const nextVideo = content
                  .slice(watchedIdx + 1)
                  .find((c) => c.type === "video");
                if (nextVideo) {
                  const nextSlug = nextVideo.videoTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  return (
                    <button
                      className={styles.continueButton}
                      onClick={() =>
                        router.push(`/video/${encodeURIComponent(nextSlug)}`)
                      }
                    >
                      Resume
                    </button>
                  );
                }
                return (
                  <button className={styles.continueButton} disabled>
                    Resume
                  </button>
                );
              })()}
            </div>
            <section className={styles.detailsSection}>
              <div className={styles.dailyChallengeCard}>
                <h3 className={styles.dailyChallengeTitle}>
                  Follow us on Social Media!
                </h3>
                <p className={styles.dailyChallengeDesc}>
                  Support our mission to spread AI and LLM education by dropping
                  a follow!
                </p>
                <button
                  className={styles.dailyChallengeButton}
                  onClick={() => {
                    const watchedIdx = content.findIndex(
                      (c) =>
                        c.videoTitle
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, "") === watchedSlug
                    );
                    const nextVideo = content
                      .slice(watchedIdx + 1)
                      .find((c) => c.type === "video");
                    const nextSlug = nextVideo?.videoTitle
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                    router.push(`/video/${encodeURIComponent(nextSlug!)}`);
                  }}
                >
                  Follow
                </button>
              </div>
            </section>
          </section>
          <div className={styles.mainContentAside}>
            {/* Spark AI Assistant box */}
            <div className={styles.fillerCard}>
              <h3>Meet Spark: Your AI Assistant</h3>
              <p>
                Get instant help, explanations, and personalized guidance from
                Spark, your AI assistant for this platform.
              </p>
              <a
                href="#"
                className={styles.continueButton}
                style={{ display: "inline-block", marginTop: "1rem" }}
                onClick={() => {
                  const watchedIdx = content.findIndex(
                    (c) =>
                      c.videoTitle
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "") === watchedSlug
                  );
                  const nextVideo = content
                    .slice(watchedIdx + 1)
                    .find((c) => c.type === "video");
                  const nextSlug = nextVideo?.videoTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  router.push(`/video/${encodeURIComponent(nextSlug!)}`);
                }}
              >
                Chat with Spark
              </a>
            </div>
            <div className={styles.fillerCard}>
              <h3>Schedule Zoom Meeting</h3>
              <p>
                Book a 1:1 session with Nikhil &amp; Vinay for project help,
                Q&amp;A, or mentorship.
              </p>
              <a
                href="mailto:nikhil23.rao@gmail.com"
                className={styles.continueButton}
                style={{ display: "inline-block", marginTop: "1rem" }}
              >
                Schedule Meeting
              </a>
            </div>
          </div>
        </div>
      </main>
      <aside className={styles.sidebarRight}>
        <div className={styles.profileSection}>
          <h1
            style={{
              position: "absolute",
              top: 20,
              right: 40,
              cursor: "pointer",
              fontSize: 18,
              color: "#d97656",
            }}
            onClick={() => setIsEditingName((v) => !v)}
            title="Edit name"
          >
            Edit
          </h1>
          <br />
          <br />
          <div className={styles.profileHeaderVertical}>
            <img
              src={url.length == 0 ? "loading" : url}
              alt="Profile"
              className={styles.profileAvatar}
            />
            {isEditingName ? (
              <input
                className={styles.profileName}
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "#d97656",
                  textAlign: "center",
                  border: "1px solid #e7c3b0",
                  borderRadius: "0.5rem",
                  padding: "0.2rem 0.5rem",
                  marginBottom: 4,
                  width: "100%",
                  background: "#fff7f2",
                }}
                value={profileName}
                maxLength={23}
                onChange={(e) => setProfileName(e.target.value)}
                onBlur={() => {
                  localStorage.setItem("profilename", profileName);
                  setIsEditingName(false);
                }}
                autoFocus
              />
            ) : (
              <div
                className={styles.profileName}
                style={{ cursor: "pointer" }}
                onClick={() => setIsEditingName(true)}
              >
                {profileName}
              </div>
            )}
          </div>
          <div className={styles.profileStats}>
            <div>
              <span className={styles.profileStatLabel}>Badges</span>
              <div className={styles.badges}>
                <span className={styles.badge}>🔥</span>
                <span className={styles.badge}>🏆</span>
                <span className={styles.badge}>💡</span>
              </div>
            </div>
            <div>
              <span className={styles.profileStatLabel}>Videos Watched</span>
              <div className={styles.profileStatValue}>{videosWatched}</div>
            </div>
          </div>
        </div>
        <div className={styles.aiCircleContainer} style={{ marginTop: "20%" }}>
          <button className={styles.aiCircleButton}>
            <img src="/logo.png" className={styles.aiCircleLogo} />
            <div className={styles.aiCircleLabel}>Spark AI</div>
          </button>
        </div>
      </aside>
    </div>
  );
}
