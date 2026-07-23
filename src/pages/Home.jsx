import { useRef, useState } from "react";
// import videoFile from "../assets/videos/lesson.mp4";
import { questions } from "../utils/quiz.js";

// Corrected direct Cloudinary streaming URL
const videoFile = "https://res.cloudinary.com/bvbtlaxk/video/upload/v1784715014/last_hai_22jul_baomq5.mp4";

const PASSING_SCORE = 8;

// Fixed: Flattened array structure so handleTimeUpdate can iterate through objects directly
const CHECKPOINTS = [
  {
    time: 56, // 0:56 - end of "what the POSH Act is / legal basis"
    title: "कानूनी आधार",
    body: "- POSH अधिनियम (कार्यस्थल पर महिलाओं का यौन उत्पीड़न अधिनियम) इस प्रशिक्षण को कानूनी आधार देता है।\n- हर कार्यस्थल के लिए इसका अनुपालन करना अनिवार्य है।",
  },
  {
    time: 110, // 1:50 - end of "who it protects / what counts as harassment"
    title: "कौन सुरक्षित है और उत्पीड़न क्या माना जाता है",
    body: "- यह कानून हर क्षेत्र में महिलाओं को सुरक्षा देता है।\n- यौन उत्पीड़न में शामिल हैं:\n  * अवांछित शारीरिक संपर्क\n  * बहुत पास खड़े होना\n  * असहज करने वाला व्यवहार\n  * अनुचित इशारे या टिप्पणियां",
  },
  {
    time: 140, // 2:20 - end of history + quid pro quo intro
    title: "यह कानून कहाँ से आया",
    body: "- शुरुआत भंवरी देवी मामले और सुप्रीम कोर्ट की याचिका से हुई, जिससे विशाखा गाइडलाइंस बनीं।\n- 'क्विड प्रो क्रो' (Quid Pro Quo): जब किसी पदोन्नति या लाभ के बदले कोई शर्त या अनुचित मांग रखी जाती है।",
  },
  {
    time: 196, // 3:16 - end of workplace scenario dramatisation
    title: "व्यावहारिक रूप में पहचानना",
    body: "- दिखाता है कि यह व्यवहार रोजमर्रा के काम में कैसे आ सकता है।\n- यह अक्सर बहुत सूक्ष्म (subtle) होता है, हमेशा स्पष्ट रूप से सामने नहीं आता।",
  },
];

export default function App() {
  const videoRef = useRef(null);

  const [name, setName] = useState(
    localStorage.getItem("username") || ""
  );

  const [started, setStarted] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const shownCheckpointsRef = useRef(new Set());

  function startQuiz() {
    if (!name.trim()) return;

    localStorage.setItem("username", name);
    setStarted(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.log("Autoplay blocked by mobile browser policy: ", err);
        });
      }
    }, 100);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || activeCheckpoint) return;

    const t = video.currentTime;

    for (const checkpoint of CHECKPOINTS) {
      const alreadyShown = shownCheckpointsRef.current.has(checkpoint.time);
      if (!alreadyShown && t >= checkpoint.time) {
        shownCheckpointsRef.current.add(checkpoint.time);
        video.pause();
        setActiveCheckpoint(checkpoint);
        break;
      }
    }
  }

  function continueVideo() {
    setActiveCheckpoint(null);
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Resume blocked: ", err);
      });
    }
  }

  function submitAnswer(index) {
    if (!currentQuestion || selectedIndex !== null) return;

    setSelectedIndex(index);

    const isCorrect = index === currentQuestion.answer;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      const nextIndex = quizIndex + 1;

      if (nextIndex < questions.length) {
        setQuizIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setSelectedIndex(null);
      } else {
        setCurrentQuestion(null);
        setSelectedIndex(null);
        setQuizActive(false);
        setFinished(true);
        localStorage.removeItem("username");
      }
    }, 900);
  }

  function handleVideoEnd() {
    setQuizIndex(0);
    setScore(0);
    setQuizActive(true);
    setCurrentQuestion(questions[0]);
  }

  function restart() {
    setStarted(false);
    setQuizActive(false);
    setFinished(false);
    setScore(0);
    setQuizIndex(0);
    setCurrentQuestion(null);
    setSelectedIndex(null);
    setActiveCheckpoint(null);
    shownCheckpointsRef.current = new Set();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }

  const passed = score >= PASSING_SCORE;

  if (!started) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101A30] p-4 sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#16223D] p-7 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
          <div className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A06A]">
            <span className="h-px w-6 bg-[#C9A06A]" />
            Mandatory Compliance Module
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-[#F7F5F1]">
            POSH Training
            <span className="block text-[#9FB0CC]">Assessment</span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#9FB0CC]">
            Watch the briefing in full. Once it ends, you'll answer{" "}
            {questions.length} questions. You need at least {PASSING_SCORE}{" "}
            correct to pass — if not, you'll need to rewatch the video and
            try again.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#7C8BA8]">
              Full name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startQuiz()}
              placeholder="As it should appear on your record"
              className="w-full rounded-lg border border-white/15 bg-[#0F182C] px-4 py-3 text-[#F7F5F1] placeholder:text-[#5C6B89] outline-none transition focus:border-[#C9A06A]"
            />
          </div>

          <button
            onClick={startQuiz}
            disabled={!name.trim()}
            className="mt-7 w-full rounded-lg bg-[#C9A06A] py-3 text-sm font-semibold uppercase tracking-wide text-[#16223D] transition hover:bg-[#D8B381] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Begin Module
          </button>

          <p className="mt-4 text-center text-[11px] text-[#5C6B89]">
            {questions.length} questions &middot; Estimated 12 minutes
          </p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101A30] p-4 sm:p-6">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16223D] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A06A]">
                Training Record
              </p>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#F7F5F1]">
                Assessment Complete
              </h1>
            </div>
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-xl ${
                passed
                  ? "border-[#6F9B7C] text-[#6F9B7C]"
                  : "border-[#B5707A] text-[#B5707A]"
              }`}
            >
              {passed ? "✓" : "!"}
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-3">
              <dt className="text-[#7C8BA8]">Participant</dt>
              <dd className="font-medium text-[#F7F5F1]">{name}</dd>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <dt className="text-[#7C8BA8]">Questions answered correctly</dt>
              <dd className="font-medium text-[#F7F5F1]">
                {score} of {questions.length}
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <dt className="text-[#7C8BA8]">Result</dt>
              <dd
                className={`font-semibold ${
                  passed ? "text-[#6F9B7C]" : "text-[#B5707A]"
                }`}
              >
                {passed ? "Passed" : "Below passing threshold"}
              </dd>
            </div>
          </dl>

          {!passed && (
            <p className="mt-5 rounded-lg bg-[#B5707A]/10 p-3 text-xs leading-relaxed text-[#D6A1A8]">
              A score of {PASSING_SCORE} or higher is required to pass. You
              must rewatch the full briefing and answer all{" "}
              {questions.length} questions again to continue.
            </p>
          )}

          <button
            onClick={restart}
            className="mt-8 w-full rounded-lg border border-[#C9A06A]/50 bg-transparent py-3 text-sm font-semibold uppercase tracking-wide text-[#C9A06A] transition hover:bg-[#C9A06A]/10"
          >
            {passed ? "Retake Module" : "Rewatch and try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101A30] p-3 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A06A]">
              POSH Training Assessment
            </p>
            <h1 className="mt-1 font-serif text-xl sm:text-2xl font-semibold text-[#F7F5F1]">
              {name}
            </h1>
          </div>

          {quizActive && (
            <div className="flex items-center gap-3">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className={`h-1.5 w-7 rounded-full transition-colors ${
                    i < quizIndex
                      ? "bg-[#C9A06A]"
                      : i === quizIndex
                      ? "bg-[#C9A06A]/50"
                      : "bg-white/15"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs font-medium text-[#7C8BA8]">
                {quizIndex + (selectedIndex !== null ? 1 : 0)}/
                {questions.length}
              </span>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
          <video
            ref={videoRef}
            src={`${videoFile}#t=0.001`}
            autoPlay
            playsInline
            crossOrigin="anonymous"
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            className="w-full"
            controls
          />
        </div>

        {quizActive && !currentQuestion && (
          <p className="mt-6 text-center text-sm text-[#9FB0CC]">
            Loading questions&hellip;
          </p>
        )}

        {/* ---------- CHECKPOINT RECAP OVERLAY ---------- */}
        {activeCheckpoint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1020]/85 p-3 backdrop-blur-sm sm:p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16223D] p-5 sm:p-9">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A06A]">
                Quick Recap
              </p>

              <h2 className="mb-4 font-serif text-lg sm:text-2xl font-semibold leading-snug text-[#F7F5F1]">
                {activeCheckpoint.title}
              </h2>

              {/* Formatted bullet list rendering */}
              <ul className="mb-7 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#9FB0CC] sm:text-base">
                {activeCheckpoint.body
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, index) => {
                    const cleanLine = line.replace(/^[\s-*]+/, "").trim();
                    return <li key={index}>{cleanLine}</li>;
                  })}
              </ul>

              <button
                onClick={continueVideo}
                className="w-full rounded-lg bg-[#C9A06A] py-3 text-sm font-semibold uppercase tracking-wide text-[#16223D] transition hover:bg-[#D8B381]"
              >
                Continue Video
              </button>
            </div>
          </div>
        )}

        {currentQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1020]/85 p-3 backdrop-blur-sm sm:p-4">
            <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#16223D] p-5 sm:max-h-[90vh] sm:p-9">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A06A]">
                Question {quizIndex + 1} of {questions.length}
              </p>

              <h2 className="mb-6 font-serif text-lg sm:text-2xl font-semibold leading-snug text-[#F7F5F1]">
                {currentQuestion.question}
              </h2>

              <div className="space-y-2.5">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedIndex === index;
                  const isCorrectOption = index === currentQuestion.answer;
                  const showState = selectedIndex !== null;

                  let stateClasses =
                    "border-white/15 hover:border-[#C9A06A]/60 hover:bg-white/[0.04]";
                  if (showState && isCorrectOption) {
                    stateClasses = "border-[#6F9B7C] bg-[#6F9B7C]/10";
                  } else if (showState && isSelected && !isCorrectOption) {
                    stateClasses = "border-[#B5707A] bg-[#B5707A]/10";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => submitAnswer(index)}
                      disabled={selectedIndex !== null}
                      className={`flex w-full items-center justify-between rounded-lg border p-3.5 text-left text-sm transition sm:p-4 sm:text-base ${stateClasses} ${
                        selectedIndex !== null ? "cursor-default" : ""
                      }`}
                    >
                      <span className="text-[#E9E4D9]">{option}</span>
                      {showState && isCorrectOption && (
                        <span className="text-[#6F9B7C]">✓</span>
                      )}
                      {showState && isSelected && !isCorrectOption && (
                        <span className="text-[#B5707A]">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}