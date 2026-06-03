'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const YEARS = [1936, 1958, 1972, 1984, 1995, 2005, 2011, 2016];
const CREAM = '#F5F0E8';

/**
 * d933990 mobile/history.html — time_sect 다이얼 인트로 모션 1:1 이식
 * jakomosofa(?p=9) 스타일: 배경 시계(fixed) + 전경 카피(scroll)
 */
export default function MobileDialIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef  = useRef<HTMLDivElement>(null);
  const tlRef      = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const circle  = circleRef.current;
    if (!section || !circle) return;

    // ── 48개 눈금 + 연도 생성 ──
    circle.innerHTML = '';
    for (let i = 0; i < 48; i++) {
      const deg = i * 7.5;
      const isEm = i % 6 === 0;
      const line = document.createElement('div');
      line.className = 'mdi-line ' + (isEm ? 'mdi-em' : 'mdi-sm');
      line.style.cssText = `position:absolute;top:50%;left:0;width:50%;height:2px;background:transparent;transform-origin:100%;transform:rotate(${deg}deg)`;
      const rect = document.createElement('div');
      rect.className = 'mdi-rect';
      rect.style.cssText = `position:absolute;top:0;left:0;height:100%;background:${CREAM};width:${isEm ? '2.6%' : '2.6%'}`;
      line.appendChild(rect);
      if (isEm) {
        const num = document.createElement('div');
        num.className = 'mdi-num';
        num.textContent = String(YEARS[(i / 6) % YEARS.length]);
        num.style.cssText = `position:absolute;left:0;top:50%;transform:translate(-92%,-50%) rotate(-90deg);white-space:nowrap;font-family:'Noto Serif KR',serif;font-weight:600;font-size:clamp(12px,3.4vw,16px);color:${CREAM};opacity:0;`;
        line.appendChild(num);
      } else {
        line.style.opacity = '0';
      }
      circle.appendChild(line);
    }

    // 시작 상태 — 시계판 75° 기울어짐
    gsap.set('.mdi-circle-box', { rotateX: 75 });

    // ── 스크럽 타임라인 ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.mdi-time-cont',
        start: 'top center',
        end: 'bottom center',
        scrub: 0,
        onEnter:     () => section.classList.add('mdi-on'),
        onLeave:     () => section.classList.remove('mdi-on'),
        onLeaveBack: () => section.classList.remove('mdi-on'),
        onEnterBack: () => section.classList.add('mdi-on'),
      },
    });

    tl
      .to('.mdi-center-line-inner', { bottom: '0' })
      .to('.mdi-circle-wrap', { opacity: 1 })
      .to('.mdi-circle-wrap', { width: '80vw', height: '80vw' })
      .to('.mdi-circle', { rotate: 360, duration: 1 }, '>-0.5')
      .to('.mdi-num', { opacity: 1 }, '>-0.4')
      .to('.mdi-em .mdi-rect', { width: '16.2%' })
      .to('.mdi-circle-wrap', { width: '100vw', height: '100vw' }, '>-0.5')
      .to('.mdi-sm', { opacity: 1 })
      .to('.mdi-circle-box', { rotateX: 0, rotateY: 0, rotateZ: 0 })
      .to('.mdi-circle-wrap', { width: '80vw', height: '80vw' }, '>-0.75')
      .to('.mdi-center-line-wrap', { rotate: 360, duration: 1.5 }, '>')
      .to('.mdi-center-line-inner', { bottom: '150%', duration: 1.5 });

    tlRef.current = tl;
    return () => { tl.kill(); ScrollTrigger.getAll().forEach((t) => { if (t.vars.trigger === '.mdi-time-cont') t.kill(); }); };
  }, []);

  return (
    <>
      {/* d933990 time_sect CSS — pseudo-element 및 !important 처리를 위해 style 태그 사용 */}
      <style>{`
        .mdi-center-line-wrap{position:fixed;left:0;top:0;width:100%;height:50%;transform-origin:bottom;z-index:0;opacity:0;pointer-events:none;transition:opacity .4s ease;}
        .mdi-on .mdi-center-line-wrap{opacity:.3;}
        .mdi-center-line-inner{position:absolute;left:50%;bottom:110%;transform:translateX(-50%);width:1px;height:300%;background:${CREAM};}
        .mdi-center-line-inner::before{content:"";position:absolute;left:50%;bottom:0;transform:translate(-50%,50%);width:7px;height:7px;border-radius:50%;background:${CREAM};}
        .mdi-circle-wrap{width:20vh;height:20vh;max-width:88vw;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);perspective:2500px;perspective-origin:top;z-index:0;opacity:0!important;pointer-events:none;transition:opacity .4s ease;}
        .mdi-on .mdi-circle-wrap{opacity:.3!important;}
        .mdi-circle-box{position:absolute;width:100%;height:100%;}
        .mdi-circle{position:absolute;width:100%;height:100%;}
        .mdi-txt{position:relative;z-index:10;text-align:center;padding:0 24px;}
        .mdi-txt-block+.mdi-txt-block{margin-top:36vh;}
      `}</style>

      <section ref={sectionRef} className="relative" style={{ backgroundColor: '#16261C' }}>
        <div className="mdi-time-cont" style={{ position: 'relative', padding: '30vh 0' }}>

          {/* [BG·fixed] 중앙선 */}
          <div className="mdi-center-line-wrap">
            <div className="mdi-center-line-inner" />
          </div>

          {/* [BG·fixed] 원형 시계 */}
          <div className="mdi-circle-wrap">
            <div className="mdi-circle-box">
              <div className="mdi-circle" ref={circleRef} />
            </div>
          </div>

          {/* [FG·z10] 카피 2단 */}
          <div className="mdi-txt">
            <div className="mdi-txt-block">
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, letterSpacing: '0.34em', color: `${CREAM}8C` }}>SINCE 1936</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, lineHeight: 1.35, color: CREAM, fontSize: 'clamp(30px,9vw,40px)', marginTop: 14 }}>
                90여 년,<br />전통의 토대를 쌓다
              </p>
            </div>
            <div className="mdi-txt-block">
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, letterSpacing: '0.34em', color: `${CREAM}8C` }}>三代 · THREE GENERATIONS</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, lineHeight: 1.35, color: CREAM, fontSize: 'clamp(30px,9vw,40px)', marginTop: 14 }}>
                끊임없는 정진으로<br />미래를 잇다
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
