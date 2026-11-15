const project = (u: number, v: number) => {
  const r = 106 + 35 * Math.cos(v),
    x = r * Math.cos(u),
    y = r * Math.sin(u),
    z = 35 * Math.sin(v),
    tilt = 0.93;
  const yy = y * Math.cos(tilt) - z * Math.sin(tilt),
    zz = y * Math.sin(tilt) + z * Math.cos(tilt),
    p = 420 / (420 + zz);
  return [260 + (x * 0.98 + yy * 0.12) * p, 170 + (yy * 0.98 - x * 0.12) * p];
};
const ring = (fixed: number, meridian: boolean) =>
  Array.from({ length: 97 }, (_, i) => {
    const t = (i / 96) * Math.PI * 2;
    const [x, y] = project(meridian ? fixed : t, meridian ? t : fixed);
    return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
export function MetricOrbit() {
  return (
    <div className="metric-orbit" aria-hidden="true">
      <svg viewBox="0 0 520 350" fill="none">
        <defs>
          <radialGradient id="orbit-halo">
            <stop stopColor="#84e0f7" stopOpacity=".2" />
            <stop offset="1" stopColor="#84e0f7" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id="orbit-stroke"
            x1="80"
            y1="90"
            x2="420"
            y2="270"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#84e0f7" stopOpacity=".07" />
            <stop offset=".65" stopColor="#84e0f7" stopOpacity=".55" />
            <stop offset="1" stopColor="#b5efff" stopOpacity=".9" />
          </linearGradient>
        </defs>
        <ellipse cx="260" cy="220" rx="190" ry="110" fill="url(#orbit-halo)" />
        <g className="orbit-wire" stroke="url(#orbit-stroke)" strokeWidth=".65">
          {Array.from({ length: 13 }, (_, i) => (
            <path key={"r" + i} d={ring((i / 13) * Math.PI * 2, false)} />
          ))}
          {Array.from({ length: 24 }, (_, i) => (
            <path key={"m" + i} d={ring((i / 24) * Math.PI * 2, true)} />
          ))}
        </g>
        <path
          d="M46 60h30M61 45v30M444 280h30M459 265v30"
          stroke="#84e0f7"
          strokeOpacity=".25"
        />
        <path d="M90 296h90M340 45h90" stroke="#84e0f7" strokeOpacity=".18" />
        <circle
          className="orbit-point"
          cx="377"
          cy="203"
          r="3"
          fill="#b9f3ff"
        />
        <circle cx="158" cy="148" r="2" fill="#84e0f7" />
      </svg>
      <span className="orbit-label orbit-label-top">01 / VOLUME</span>
      <span className="orbit-label orbit-label-bottom">02 / LIQUIDITY</span>
    </div>
  );
}
