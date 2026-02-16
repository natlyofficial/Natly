import QuizModeScreen from "../components/quiz/screens/QuizModeScreen";
import ConfigScreen from "../components/quiz/screens/ConfigScreen";
import EasyOptions from "../components/quiz/easy/EasyOptions";
import EasyGuideOption from "../components/quiz/easy/EasyGuideOption";
import ResultsScreen from "../components/quiz/screens/ResultsScreen";

import {
  QuizFlowProvider,
  useQuizFlow,
} from "../components/quiz/context/QuizFlowContext";

/* ================================
   Internal Router
================================ */

function QuizRouter() {
  const { state } = useQuizFlow();

  switch (state.step) {
    case "mode":
      return <QuizModeScreen />;

    case "config":
      return <ConfigScreen />;

    case "easy-options":
      return <EasyOptions />;

    case "easy-guide":
      return <EasyGuideOption />;

    case "results":
      return <ResultsScreen />;

    default:
      return null;
  }
}

/* ================================
   Page
================================ */

export default function Quiz() {
  const hasNatlyPlus = false;

  return (
    <QuizFlowProvider hasNatlyPlus={hasNatlyPlus}>
      <QuizRouter />
    </QuizFlowProvider>
  );
}