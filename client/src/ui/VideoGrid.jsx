import { useEffect, useRef } from 'react';

export default function VideoGrid({ localStream, peers }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
      <VideoTile label="You" streamRef={localStream} isLocal />
      {peers.map(p => (
        <VideoTile key={p.id} label={p.id.slice(0, 6)} streamObj={p} />
      ))}
    </div>
  );
}

function VideoTile({ streamRef, streamObj, label, isLocal = false }) {
  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-white/10">
      <VideoEl streamRef={streamRef} streamObj={streamObj} isLocal={isLocal} />
      <div className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded-md text-white font-medium">
        {label} {isLocal && '(You)'}
      </div>
    </div>
  );
}

function VideoEl({ streamRef, streamObj, isLocal }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const stream = streamRef?.current || streamObj?.stream;

    if (el && stream) {
      el.srcObject = stream;
    }
  }, [streamRef?.current, streamObj?.stream]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={isLocal}
      className="w-full h-[320px] object-cover bg-black"
    />
  );
}
