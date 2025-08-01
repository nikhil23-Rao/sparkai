"use client";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import "./globals.css";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroRef.current.style.setProperty("--x", `${x}%`);
      heroRef.current.style.setProperty("--y", `${y}%`);
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);
  useEffect(() => {
    document.title = "New Tab Name";
  }, [typeof document]);

  return (
    <>
      <Head>
        <title>Learn AI & LLMS</title>
      </Head>
      <div style={{ overflowY: "scroll", height: "100vh" }}>
        <nav className={styles.navbar}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logo}>Spark</h1>
            <span className={styles.logoSubtitle}> .by Nikhil & Vinay</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>
              Features
            </a>
            <a href="#team" className={styles.navLink}>
              Meet the Team
            </a>
            <a href="#privacy" className={styles.navLink}>
              Privacy
            </a>
          </div>
        </nav>
        <main ref={heroRef} className={styles.heroSection}>
          <div className={styles.waves}>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
          <div className={styles.dotPattern}></div>
          <div className={styles.heroContent}>
            <div
              className={styles.notificationBadge}
              style={{ marginTop: -90 }}
            >
              tailored to all
            </div>
            <h1 className={styles.heroTitle}>
              AI & LLMs <br />
              Made <span className={styles.accent}>Easy...</span>
            </h1>
            <p
              className={styles.heroSubtitle}
              style={{
                fontSize: "2em",
                animation: "blink 0.75s step-end infinite",
              }}
            >
              Experience personalized learning that adapts to your pace and
              goals
            </p>
            <div className={styles.heroButtons}>
              <Link href="/main" className={styles.primaryButton}>
                Start Your Journey
              </Link>
              <a
                href="#learn-more"
                onClick={() => alert("coming soon")}
                className={styles.secondaryButton}
              >
                Assign Lessons
              </a>
            </div>
          </div>
        </main>
        <section id="features" className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.featuresContainer}>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Personalized Learning</h3>
              <p className={styles.featureDescription}>
                Tailored lessons and activities that adapt to your pace and
                goals.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Interactive Activities</h3>
              <p className={styles.featureDescription}>
                Engage with hands-on activities to deepen your understanding.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>AI-Powered Assistance</h3>
              <p className={styles.featureDescription}>
                Get instant help and insights from our intelligent assistant.
              </p>
            </div>
          </div>
        </section>
        <section id="team" className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Meet the Team</h2>
          <div className={styles.teamContainer}>
            <div className={styles.teamMember}>
              <img
                src="/nikhil.jpeg" // Replace with the first team member's image
                alt="Team Member 1"
                className={styles.teamImage}
              />
              <h3 className={styles.teamName}>Nikhil Rao</h3>
              <p className={styles.teamRole}>Senior @Dougherty Valley</p>
              <p className={styles.teamDescription}>
                Nikhil started coding in 6th grade and has built numerous
                AI-related apps. He is currently conducting research at UC
                Berkeley's EPIC Data Lab.
              </p>
            </div>
            <div className={styles.teamMember}>
              <img
                src="/vinay.avif" // Replace with the second team member's image
                alt="Team Member 2"
                className={styles.teamImage}
              />
              <h3 className={styles.teamName}>Vinay</h3>
              <p className={styles.teamRole}>Senior @Dougherty Valley</p>
              <p className={styles.teamDescription}>
                Vinay began his coding journey in 6th grade, creating innovative
                AI applications. He is also engaged in research at UC Berkeley's
                EPIC Data Lab.
              </p>
            </div>
          </div>
        </section>
        <footer className={styles.footer}>
          <p>&copy; 2025-2026 SparkAI. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
