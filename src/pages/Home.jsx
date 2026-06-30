import { useRef, useState } from "react";
import videoFile from "../assets/videos/lesson.mp4";
import { questions } from "../utils/quiz.js";

export default function App() {
  const videoRef = useRef(null);

  const [name, setName] = useState(
    localStorage.getItem("username") || ""
  );

  const [started, setStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [answered, setAnswered] = useState([]);

  const [score, setScore] = useState(0);

  const [finished, setFinished] = useState(false);

  function startQuiz() {
    if (!name.trim()) return;

    localStorage.setItem("username", name);

    setStarted(true);
  }

  function handleTimeUpdate() {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;

    const question = questions.find(
      (q) =>
        currentTime >= q.time &&
        !answered.includes(q.id)
    );

    if (question) {
      videoRef.current.pause();
      setCurrentQuestion(question);
    }
  }

  function submitAnswer(index) {
  if (!currentQuestion) return;

  if (index === currentQuestion.answer) {
    setScore((s) => s + 1);
  }

  setAnswered((prev) => [...prev, currentQuestion.id]);

  setCurrentQuestion(null);

  videoRef.current?.play();
}

  function handleVideoEnd() {
    setFinished(true);
    localStorage.removeItem("username");
  }

  function restart() {
    setStarted(false);
    setFinished(false);
    setScore(0);
    setAnswered([]);
    setCurrentQuestion(null);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }

  if (!started) {
    return (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-800/70 p-8 shadow-2xl backdrop-blur">
      <h1 className="text-center text-4xl font-bold text-white">
        Interactive Quiz
      </h1>

      <p className="mt-2 text-center text-slate-400">
        Watch the video and answer questions along the way.
      </p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="mt-8 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
      />

      <button
        onClick={startQuiz}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Start Quiz →
      </button>
    </div>
  </div>
);
  }

  if (finished) {
    return (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <div className="w-full max-w-md rounded-3xl bg-slate-800 p-10 text-center shadow-2xl">

      <div className="mb-4 text-7xl">🎉</div>

      <h1 className="text-4xl font-bold text-white">
        Quiz Completed
      </h1>

      <p className="mt-2 text-slate-400">
        Great job, {name}
      </p>

      <div className="my-8 rounded-2xl bg-slate-900 p-6">

        <p className="text-slate-400">
          Your Score
        </p>

        <h2 className="mt-2 text-6xl font-bold text-green-400">
          {score}/{questions.length}
        </h2>

      </div>

      <button
        onClick={restart}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Play Again
      </button>

    </div>
  </div>
);
  }

  return (
  <div className="min-h-screen bg-slate-950 p-8">
    <div className="mx-auto max-w-5xl">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, {name} 👋
          </h1>

          <p className="text-slate-400">
            Score: {score} / {questions.length}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl shadow-2xl">

        <video
          ref={videoRef}
          src={videoFile}
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          className="w-full"
        />

        {currentQuestion && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-3xl bg-white p-8">

              <p className="mb-2 text-sm text-slate-500">
                Question {answered.length + 1} of {questions.length}
              </p>

              <h2 className="mb-6 text-2xl font-bold">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => submitAnswer(index)}
                    className="w-full rounded-xl border border-slate-300 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    {option}
                  </button>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  </div>
);
}