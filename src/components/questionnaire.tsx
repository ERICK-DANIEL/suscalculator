"use client";

import { useEffect, useRef, useState } from "react";
import {
  SUS_QUESTION_COUNT,
  SUS_REVERSE,
  type SusEntry,
} from "@/lib/sus";
import { newEntryId, saveEntry } from "@/lib/storage";
import { fmt, useI18n } from "@/lib/i18n";
import { IconCheck, IconClose } from "./icons";

interface QuestionnaireProps {
  projectId: string;
  existingEntryCount: number;
  editing?: SusEntry | null;
  onClose: () => void;
}

export function Questionnaire({
  projectId,
  existingEntryCount,
  editing,
  onClose,
}: QuestionnaireProps) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<number[]>(() =>
    editing ? [...editing.answers] : new Array(SUS_QUESTION_COUNT).fill(0),
  );
  const [participant, setParticipant] = useState(editing?.participant ?? "");
  const [step, setStep] = useState(() =>
    editing
      ? SUS_QUESTION_COUNT
      : nextUnanswered(new Array(SUS_QUESTION_COUNT).fill(0), -1),
  );
  const cardRef = useRef<HTMLDivElement>(null);

  const answeredCount = answers.filter((a) => a > 0).length;
  const complete = answeredCount === SUS_QUESTION_COUNT;
  const isReview = step >= SUS_QUESTION_COUNT;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    cardRef.current?.scrollTo({ top: 0 });
  }, [step]);

  function pickAnswer(questionIndex: number, value: number) {
    const updated = [...answers];
    updated[questionIndex] = value;
    setAnswers(updated);
    if (!isReview && questionIndex === step) {
      const next = nextUnanswered(updated, questionIndex);
      setStep(next);
    }
  }

  function handleSave() {
    if (!complete) return;
    saveEntry(projectId, {
      id: editing?.id ?? newEntryId(),
      participant:
        participant.trim() ||
        fmt(t.questionnaire.participantDefault, {
          n: existingEntryCount + 1,
        }),
      answers,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-inverse-surface/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={editing ? t.questionnaire.editTitle : t.questionnaire.newTitle}
        className="mx-auto my-6 w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-luminous-hover sm:my-12"
      >
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-8 py-5">
          <div>
            <h2 className="text-headline-md font-headline text-on-surface">
              {editing ? t.questionnaire.editTitle : t.questionnaire.newTitle}
            </h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              {t.questionnaire.scaleHint}
            </p>
          </div>
          <button
            type="button"
            aria-label={t.questionnaire.closeAria}
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <IconClose className="h-[22px] w-[22px]" />
          </button>
        </div>

        <div className="h-1 bg-surface-container-high">
          <div
            className="h-full bg-active-indicator transition-all duration-300"
            style={{ width: `${(answeredCount / SUS_QUESTION_COUNT) * 100}%` }}
          />
        </div>

        {!isReview ? (
          <div className="px-8 py-8" key={step}>
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-md bg-surface-container-high px-2 py-1 text-data-mono shadow-sm text-on-surface">
                Q{step + 1}
              </span>
              <span
                className={`text-[12px] font-bold uppercase ${SUS_REVERSE[step] ? "text-error" : "text-secondary"}`}
              >
                {SUS_REVERSE[step]
                  ? t.questionnaire.negative
                  : t.questionnaire.positive}
              </span>
              <span className="ml-auto text-body-sm font-medium tabular-nums text-on-surface-variant">
                {step + 1} / {SUS_QUESTION_COUNT}
              </span>
            </div>
            <p className="min-h-16 max-w-xl text-lg leading-snug font-medium text-on-surface">
              {t.sus.questions[step]}
            </p>
            <div className="mt-8 flex flex-wrap items-start gap-3 sm:gap-5">
              {t.sus.likert.map((label, i) => {
                const value = i + 1;
                const selected = answers[step] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => pickAnswer(step, value)}
                    aria-label={`${value}: ${label}`}
                    className="group flex cursor-pointer flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-active-indicator focus-visible:ring-offset-2"
                  >
                    <span
                      className={`text-body-sm font-medium transition-colors ${selected ? "text-active-indicator" : "text-on-surface-variant group-hover:text-on-surface"}`}
                    >
                      {value}
                    </span>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 shadow-sm transition-all ${
                        selected
                          ? "border-transparent bg-active-indicator text-on-primary shadow-md shadow-active-indicator/30"
                          : "border-outline-variant bg-surface-container-lowest hover:border-outline"
                      }`}
                    >
                      {selected && (
                        <IconCheck className="h-6 w-6" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 min-h-5 text-body-sm text-outline">
              {answers[step] > 0 ? t.sus.likert[answers[step] - 1] : ""}
            </p>
          </div>
        ) : (
          <div className="px-8 py-8">
            <p className="mb-2 text-label-caps uppercase text-primary">
              {t.questionnaire.reviewTitle}
            </p>
            <p className="max-w-xl text-body-lg font-medium text-on-surface">
              {t.questionnaire.reviewBody}
            </p>
            <div className="mt-6 grid grid-cols-5 gap-2 sm:max-w-sm">
              {answers.map((value, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStep(i)}
                  title={fmt(t.questionnaire.questionTitle, {
                    n: i + 1,
                    answer:
                      value > 0
                        ? t.sus.likert[value - 1]
                        : t.questionnaire.unanswered,
                  })}
                  className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-2 text-data-mono font-bold transition-all hover:scale-105 ${
                    value > 0
                      ? "border-transparent bg-active-indicator text-on-primary shadow-sm shadow-active-indicator/30"
                      : "border-dashed border-outline-variant text-outline"
                  }`}
                >
                  {value || "–"}
                </button>
              ))}
            </div>
            <div className="mt-8">
              <label
                htmlFor="participant-input"
                className="text-label-caps mb-1.5 block uppercase text-on-surface-variant"
              >
                {t.questionnaire.participantLabel}
              </label>
              <input
                id="participant-input"
                type="text"
                maxLength={60}
                value={participant}
                onChange={(e) => setParticipant(e.target.value)}
                placeholder={fmt(t.questionnaire.participantPlaceholder, {
                  n: existingEntryCount + 1,
                })}
                className="w-full max-w-sm rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-lg outline-none transition placeholder:text-outline/70 focus:border-active-indicator focus:ring-4 focus:ring-active-indicator/10"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-8 py-5">
          <span className="text-body-sm tabular-nums text-on-surface-variant">
            {fmt(t.questionnaire.answeredCount, {
              done: answeredCount,
              total: SUS_QUESTION_COUNT,
            })}
          </span>
          <div className="flex gap-3">
            {isReview ? (
              complete && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-luminous"
                >
                  {editing
                    ? t.questionnaire.saveChanges
                    : t.questionnaire.saveEvaluation}
                </button>
              )
            ) : (
              <button
                type="button"
                disabled={answers[step] === 0}
                onClick={() => setStep(nextUnanswered(answers, step))}
                className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all enabled:hover:bg-primary-container enabled:hover:shadow-luminous disabled:opacity-40 disabled:shadow-none"
              >
                {t.questionnaire.next}
              </button>
            )}
            {step > 0 && (
              <button
                type="button"
                onClick={() =>
                  isReview ? setStep(SUS_QUESTION_COUNT - 1) : setStep(step - 1)
                }
                className="cursor-pointer rounded-lg border border-outline px-5 py-2.5 text-data-mono uppercase tracking-wide text-on-surface transition-all hover:bg-surface-variant hover:border-on-surface"
              >
                {t.questionnaire.back}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function nextUnanswered(answers: number[], from: number): number {
  for (let i = from + 1; i < answers.length; i++) {
    if (answers[i] === 0) return i;
  }
  return answers.length;
}
