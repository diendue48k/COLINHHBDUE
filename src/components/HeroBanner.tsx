'use client';

import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="w-full relative overflow-hidden bg-[#07284C] shadow-md border-b border-blue-900/30">
      <div className="w-full mx-auto">
        <img
          src="/images/banner-due.png"
          alt="Cổng thông tin học bổng – Trường Đại học Kinh tế, Đại học Đà Nẵng"
          className="w-full h-auto max-h-[300px] md:max-h-[350px] lg:max-h-[380px] object-cover object-center block"
          loading="eager"
        />
      </div>

      {/* Đường viền trang trí nhận diện màu sắc DUE: Cam (#F26524) - Xanh lá (#119046) - Xanh dương (#1760AB) */}
      <div
        className="w-full h-1 sm:h-1.5"
        style={{
          background: 'linear-gradient(90deg, #F26524 0%, #119046 50%, #1760AB 100%)',
        }}
      />
    </section>
  );
};
