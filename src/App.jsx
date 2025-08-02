import { useEffect, useRef, useState } from "react";

// Helper used to extract the URL and flag from the challenge page.
// (() => {
//   const nodes = document.querySelectorAll(
//     'section[data-id^="92"] article[data-class$="45"] div[data-tag*="78"] b.ref[value]'
//   );
//   const url = Array.from(nodes, n => n.getAttribute('value')).join('');
//   console.log('URL:', url);
//   fetch(url).then(r => r.text()).then(t => console.log('FLAG:', t.trim()));
// })();

const FLAG_URL = "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/7a6561";
const TYPING_DELAY_MS = 500; // 0.5s per character

export default function App() {
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const started = useRef(false);
  const timer = useRef(null);

  // Load the flag
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(FLAG_URL);
        const text = (await res.text()).trim();
        if (!cancelled) {
          setFlag(text);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setFlag("error");
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Start the typewriter after flag is loaded and run only once
  useEffect(() => {
    if (loading || !flag || started.current) return;
    started.current = true;
    timer.current = setInterval(() => {
      setVisibleCount((n) => {
        if (n + 1 >= flag.length) {
          clearInterval(timer.current);
          return flag.length;
        }
        return n + 1;
      });
    }, TYPING_DELAY_MS);
    return () => clearInterval(timer.current);
  }, [loading, flag]);

  if (loading) return <div>Loading...</div>;

  const chars = flag.slice(0, visibleCount).split("");

  return (
    <ul>
      {chars.map((ch, i) => (
        <li key={i}>{ch}</li>
      ))}
    </ul>
  );
}