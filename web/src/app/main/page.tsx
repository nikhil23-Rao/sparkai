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
  // Example watched state for each video (replace with real data as needed)
  const watched = [true, false, true, false, false];

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
                {items.map((item, i) => (
                  <li key={item.videoTitle} style={{ padding: 7 }}>
                    <button
                      className={styles.moduleLink}
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        router.push(
                          `/video/${encodeURIComponent(
                            item.videoTitle
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, "")
                          )}`
                        )
                      }
                    >
                      <FontAwesomeIcon
                        style={{ width: 20 }}
                        icon={getSidebarIcon(item)}
                        className={styles.moduleIcon}
                      />
                      {item.videoTitle}
                    </button>
                  </li>
                ))}
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
        <div className={styles.searchBarWrapper}>
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Search courses, lessons, or resources..."
          />
        </div>
        <div className={styles.banner}>
          <div className={styles.bannerWave}></div>
          <div className={styles.bannerText}>Welcome back, Nikhil!</div>
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
                  Lesson 5: Introduction to LLMs
                </div>
                <div className={styles.lessonProgress}>Progress: 65%</div>
              </div>
              <button className={styles.continueButton}>Resume</button>
            </div>
            <section className={styles.detailsSection}>
              <div className={styles.dailyChallengeCard}>
                <h3 className={styles.dailyChallengeTitle}>Daily Challenge</h3>
                <p className={styles.dailyChallengeDesc}>
                  Can you prompt an LLM to write a poem about space in exactly 5
                  lines? Try your best and share your result!
                </p>
                <button
                  className={styles.dailyChallengeButton}
                  onClick={() => alert("Opening today's challenge...")}
                >
                  Open Challenge
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
                href="#"
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
            }}
          >
            edit{" "}
          </h1>
          <br />
          <br />
          <div className={styles.profileHeaderVertical}>
            <img
              src={url.length == 0 ? "loading" : url}
              alt="Profile"
              className={styles.profileAvatar}
            />
            <div className={styles.profileName}>Nikhil Rao</div>
            <div className={styles.profileUsername}>@nikhilrao</div>
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
              <div className={styles.profileStatValue}>24</div>
            </div>
            <div>
              <span className={styles.profileStatLabel}>Projects Made</span>
              <div className={styles.profileStatValue}>5</div>
            </div>
          </div>
        </div>
        <div className={styles.aiCircleContainer} style={{ marginTop: "20%" }}>
          <button
            className={styles.aiCircleButton}
            onClick={() => alert("Spark AI coming soon!")}
          >
            <img src="/logo.png" className={styles.aiCircleLogo} />
            <div className={styles.aiCircleLabel}>Spark AI</div>
          </button>
        </div>
      </aside>
    </div>
  );
}
