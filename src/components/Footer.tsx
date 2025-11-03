"use client";

import { useRef } from "react";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import styles from "./Footer.module.css";

export default function Footer() {
  const ref = useRef(null);

  const socialLinks = [
    {
      title: "GitHub",
      icon: <Github size={20} />,
      href: "https://github.com/rudra-sah00",
    },
    {
      title: "LinkedIn",
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/in/rudra-narayana-sahoo-695342288/",
    },
    {
      title: "Instagram",
      icon: <Instagram size={20} />,
      href: "https://www.instagram.com/rudra.sah00/",
    },
    {
      title: "Email",
      icon: <Mail size={20} />,
      href: "mailto:rudranarayanaknr@gmail.com",
    },
  ];

  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Get in Touch Section - Centered */}
        <div className={styles.getInTouchSection}>
          <div className={styles.getInTouchContainer}>
            <div className={styles.getInTouchContent}>
              <h4 className={styles.getInTouchTitle}>Get in Touch</h4>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <FloatingDock
                  items={socialLinks}
                  desktopClassName={styles.customFloatingDock}
                  mobileClassName={styles.customFloatingDock}
                />
              </div>
              <p className={styles.getInTouchEmail}>
                rudranarayanaknr@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Large Name at Bottom - PAISANA Style */}
        <div className={styles.largeNameSection}>
          <div className={styles.largeNameContainer}>
            <div className={styles.largeNameContent}>
              <h1 className={styles.largeName}>RUDRA SAHOO</h1>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
