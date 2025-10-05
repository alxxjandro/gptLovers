import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

export default function GlobeVisual() {
  const globeRef = useRef();

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
    <div className="globe-wrapper">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0, 0, 0, 0)"
        showAtmosphere={true}
        atmosphereColor="#64b5f6"
        atmosphereAltitude={0.25}
        width={600}
        height={600}
      />
    </div>
  );
}
