"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Anton } from "next/font/google";
import { ChevronRight, Pause, Play } from "lucide-react";
import { BENTO_BIG, BENTO_HEADING, BENTO_TILES } from "../lib/homeBento";

// Freelancer'daki dar, kalın başlık yazısının karşılığı; latin-ext Türkçe harfleri (İ, Ş, Ğ, ı) içerir.
// Yalnızca bento'da kullanılır, tek ağırlık; next/font kendi sunucumuzdan verir (Google'a istek gitmez).
const display = Anton({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap" });

// Ana sayfa "vurucu alan" (2026-10-17), Freelancer'ın bento'su ile aynı kurgu:
// - Büyük kutucuk: hep görünen, LED/ekran dokulu parlayan başlık; arkasında video (BENTO_BIG.video)
//   ya da sırayla değişen görseller (BENTO_BIG.frames). Video sessiz, döngülü, kapak karesiyle başlar;
//   ekran dışındayken durur; hareket azaltılmışsa ya da veri tasarrufu açıksa yalnızca kapak.
//   Görsel değişimi saniyede birin altında (ışığa duyarlılık için güvenli).
// - Küçük kutucuklar: durgunken yalnızca görsel; üzerine gelince kendi rengine boyanır, büyük başlık
//   belirir ve alttan tek cümle + düğme açılır. Dokunmatikte başlık hep görünür, dokununca açılır.
// İçerik ve görsel yolları lib/homeBento.js'te (kurucu seçer; vitrin kapağı kullanılmaz).
export default function HomeBento({ onOpen }) {
  const frames = BENTO_BIG.frames || [];
  const video = BENTO_BIG.video || null;
  const [frame, setFrame] = useState(0);
  const [allowMotion, setAllowMotion] = useState(false);
  const bigRef = useRef(null);
  const videoRef = useRef(null);
  // Kullanıcı videoyu durdurabilsin (WCAG 2.2.2): durdurulunca ekrana girip çıkmak yeniden başlatmaz.
  const [userPaused, setUserPaused] = useState(false);
  const userPausedRef = useRef(false);
  const toggleVideo = () => {
    const v = videoRef.current; if (!v) return;
    const next = !userPausedRef.current; userPausedRef.current = next; setUserPaused(next);
    if (next) v.pause(); else v.play().catch(() => {});
  };

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;
    setAllowMotion(!reduce && !saveData);
  }, []);

  useEffect(() => {
    if (!allowMotion || video || frames.length < 2) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), 1400);
    return () => clearInterval(id);
  }, [allowMotion, video, frames.length]);

  // Video yalnızca ekrandayken oynar (pil ve veri için).
  useEffect(() => {
    if (!allowMotion || !video || !bigRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      const v = videoRef.current;
      if (!v) return;
      if (e.isIntersecting) { if (!userPausedRef.current) v.play().catch(() => {}); } else v.pause();
    }, { threshold: 0.25 });
    io.observe(bigRef.current);
    return () => io.disconnect();
  }, [allowMotion, video]);

  return (
    <section className="pt-7 sm:pt-10 pb-8" aria-label={BENTO_BIG.title}>
      <h2 className="px-5 sm:px-8 mb-5 sm:mb-6 font-sans text-[22px] sm:text-3xl font-black tracking-tight [text-wrap:balance]" style={{ color: "#FFFFFF" }}>
        {BENTO_HEADING.lead} <span style={{ color: "#60A5FA" }}>{BENTO_HEADING.accent}</span>
      </h2>
      <div className="bento px-5 sm:px-8">
        <div className="bento-big-cell">
        <button type="button" ref={bigRef} className="bento-big" onClick={() => onOpen(BENTO_BIG.example)}>
          {video ? (
            allowMotion ? (
              <video ref={videoRef} className="bento-video" muted loop playsInline preload="none" poster={video.poster} aria-hidden="true">
                {video.webm && <source src={video.webm} type="video/webm" />}
                {video.mp4 && <source src={video.mp4} type="video/mp4" />}
              </video>
            ) : (
              video.poster && <span className="bento-frame on" style={{ backgroundImage: `url("${video.poster}")` }} aria-hidden="true" />
            )
          ) : (
            frames.map((u, i) => (
              <span key={u} className={`bento-frame${i === frame ? " on" : ""}`} style={{ backgroundImage: `url("${u}")` }} aria-hidden="true" />
            ))
          )}
          <span className={`bento-headline ${display.className}`} lang="tr">{BENTO_BIG.title}</span>
          <span className="bento-bar">
            <span className="bento-bar-text">{BENTO_BIG.pitch}</span>
            <span className="bento-btn" style={{ background: "#2563EB" }}>{BENTO_BIG.cta} <ChevronRight size={14} /></span>
          </span>
        </button>
        {video && allowMotion && (
          <button type="button" onClick={toggleVideo} className="bento-pause" aria-label={userPaused ? "Videoyu oynat" : "Videoyu durdur"}>
            {userPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        )}
        </div>
        {BENTO_TILES.map((tile) => (
          <button type="button" key={tile.id} className="bento-tile" style={{ "--tint": tile.color }} onClick={() => onOpen(tile.example)}>
            <span className="bento-media">
              {tile.image ? (
                <Image src={tile.image} alt="" fill sizes="(max-width: 767px) 50vw, 25vw" className="bento-img" />
              ) : (
                <span className="bento-noimg" style={{ background: `linear-gradient(140deg, ${tile.color} 0%, #0B0B0F 85%)` }} />
              )}
              <span className="bento-tint" />
              <span className={`bento-title ${display.className}`} lang="tr">{tile.title}</span>
            </span>
            <span className="bento-panel">
              <span className="bento-panel-text">{tile.pitch}</span>
              <span className="bento-btn" style={{ background: tile.color }}>{tile.cta} <ChevronRight size={13} /></span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
