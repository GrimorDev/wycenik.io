import type { Answer, CalculatorQuestion } from "../../src/lib/calculator/types";

interface Props {
  question: CalculatorQuestion;
  answer?: Answer;
  onChange: (answer: Answer) => void;
}

function CheckIcon() {
  return (
    <svg class="wk-check" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-6.5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
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
              class="wk-option-input"
              checked={selected === option.id}
              onChange={() =>
                onChange({ questionId: question.id, type: "single_choice", optionId: option.id })
              }
            />
            <span class="wk-option-indicator">
              <CheckIcon />
            </span>
            <span class="wk-option-label">{option.label}</span>
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
              class="wk-option-input"
              checked={checked}
              onChange={() => {
                const next = checked
                  ? selectedIds.filter((id) => id !== option.id)
                  : [...selectedIds, option.id];
                onChange({ questionId: question.id, type: "checkbox", optionIds: next });
              }}
            />
            <span class="wk-option-indicator wk-option-indicator-square">
              <CheckIcon />
            </span>
            <span class="wk-option-label">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
