import type { Answer, CalculatorQuestion } from "../../src/lib/calculator/types";

interface Props {
  question: CalculatorQuestion;
  answer?: Answer;
  onChange: (answer: Answer) => void;
}

export function QuestionInput({ question, answer, onChange }: Props) {
  if (question.type === "number_slider") {
    const value = answer?.type === "number_slider" ? answer.value : question.config.min;
    return (
      <div class="wk-slider">
        <input
          type="range"
          min={question.config.min}
          max={question.config.max}
          step={question.config.step}
          value={value}
          onInput={(e) =>
            onChange({
              questionId: question.id,
              type: "number_slider",
              value: Number((e.target as HTMLInputElement).value),
            })
          }
        />
        <div class="wk-slider-value">
          {value}
          {question.config.unit ? ` ${question.config.unit}` : ""}
        </div>
      </div>
    );
  }

  if (question.type === "single_choice") {
    const selected = answer?.type === "single_choice" ? answer.optionId : undefined;
    return (
      <div class="wk-options">
        {question.options.map((option) => (
          <label
            key={option.id}
            class={`wk-option${selected === option.id ? " wk-option-selected" : ""}`}
          >
            <input
              type="radio"
              name={question.id}
              checked={selected === option.id}
              onChange={() =>
                onChange({ questionId: question.id, type: "single_choice", optionId: option.id })
              }
            />
            {option.label}
          </label>
        ))}
      </div>
    );
  }

  const selectedIds = answer?.type === "checkbox" ? answer.optionIds : [];
  return (
    <div class="wk-options">
      {question.options.map((option) => {
        const checked = selectedIds.includes(option.id);
        return (
          <label key={option.id} class={`wk-option${checked ? " wk-option-selected" : ""}`}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                const next = checked
                  ? selectedIds.filter((id) => id !== option.id)
                  : [...selectedIds, option.id];
                onChange({ questionId: question.id, type: "checkbox", optionIds: next });
              }}
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
