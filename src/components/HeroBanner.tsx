'use client';

import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="w-full relative overflow-hidden bg-white shadow-xs border-b border-slate-200/80">
      <div className="w-full mx-auto max-w-[1920px]">
        <img
          src="/images/banner-due-co-hoi.png"
          alt="Cổng thông tin học bổng – Trường Đại học Kinh tế, Đại học Đà Nẵng"
          className="w-full h-auto block"
          loading="eager"
        />
      </div>
    </section>
  );
};
