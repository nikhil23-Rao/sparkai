"use client";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import "./globals.css";
import Link from "next/link";

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

  return (
    <>
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
          <a href="#continue" className={styles.navLink}>
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
          <div className={styles.notificationBadge} style={{ marginTop: -90 }}>
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
            Experience personalized learning that adapts to your pace and goals
          </p>
          <div className={styles.heroButtons}>
            <Link href="/main" className={styles.primaryButton}>
              Start Your Journey
            </Link>
            <a href="#learn-more" className={styles.secondaryButton}>
              Assign Lessons
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
