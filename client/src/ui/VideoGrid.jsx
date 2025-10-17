export default function VideoGrid({ localStream, peers }) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <VideoTile streamRef={localStream} label="You" />
      {peers.map(p => <VideoTile key={p.id} streamObj={p} label={p.id.slice(0,6)} />)}
    </div>
  )
}

function VideoTile({ streamRef, streamObj, label }) {
  return (
    <div className="relative bg-black rounded overflow-hidden">
      <VideoEl streamRef={streamRef} streamObj={streamObj}/>
      <div className="absolute bottom-2 left-2 text-xs bg-white/20 px-2 py-1 rounded">{label}</div>
    </div>
  )
}

import { useEffect, useRef } from 'react';
function VideoEl({ streamRef, streamObj }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const stream = streamRef?.current || streamObj?.stream;
    if (el && stream) el.srcObject = stream;
  }, [streamRef, streamObj]);
  return <video ref={ref} autoPlay playsInline muted={!!streamRef} style={{width:'100%',height:'280px',objectFit:'cover'}}/>
}
