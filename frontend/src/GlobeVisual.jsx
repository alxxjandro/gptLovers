import { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";

export default function GlobeVisual({ darkTheme }) {
  const globeRef = useRef();
  const [size, setSize] = useState(600);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        setSize(450);
      } else {
        setSize(600);
      }
    };

    updateSize(); // inicial
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
    }
  }, []);

  return (
    <div
      className="globe-wrapper"
      style={{
        paddingTop: window.innerWidth < 768 ? "4rem" : "0",
      }}
    >
      <Globe
        ref={globeRef}
        globeImageUrl={
          !darkTheme
            ? "//unpkg.com/three-globe/example/img/earth-day.jpg"
            : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        }
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0, 0, 0, 0)"
        showAtmosphere={true}
        atmosphereColor="#64b5f6"
        atmosphereAltitude={0.25}
        width={size}
        height={size}
      />
    </div>
  );
}
