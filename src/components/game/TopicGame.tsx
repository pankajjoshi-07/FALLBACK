"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Shield, Sword, Heart, Trophy, Skull, PartyPopper, Coins } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { TOPIC_GAMES, FALLBACK_BOSS, GameBoss } from "@/server/game/game-data";

interface TopicGameProps {
  topic: string;
  onWin: () => void;
  onCancel: () => void;
}

export function TopicGame({ topic, onWin, onCancel }: TopicGameProps) {
  const [boss, setBoss] = useState<GameBoss | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [monsterHp, setMonsterHp] = useState(100);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load boss data
    const data = TOPIC_GAMES[topic] || FALLBACK_BOSS;
    setBoss(data);
    setMonsterHp(data.hp);
    setPlayerHp(100);
    setCurrentQuestionIndex(0);
    setGameStatus("playing");
    setShowExplanation(false);
    setSelectedOption(null);
  }, [topic]);

  if (!boss) return <div className="p-8 text-center text-foreground animate-pulse">Loading Game Engine...</div>;

  const currentQuestion = boss.questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (showExplanation || gameStatus !== "playing") return;
    
    setSelectedOption(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      // Calculate damage based on how many questions there are
      const damage = Math.ceil(boss.hp / boss.questions.length);
      const newMonsterHp = Math.max(0, monsterHp - damage);
      setMonsterHp(newMonsterHp);
      
      if (newMonsterHp === 0 || currentQuestionIndex === boss.questions.length - 1) {
        setTimeout(() => setGameStatus("won"), 2000);
      }
    } else {
      const damage = 34; // Roughly 3 wrong answers = death
      const newPlayerHp = Math.max(0, playerHp - damage);
      setPlayerHp(newPlayerHp);
      
      if (newPlayerHp === 0) {
        setTimeout(() => setGameStatus("lost"), 2000);
      }
    }
  };

  const handleNextQuestion = () => {
    if (gameStatus !== "playing") return;
    
    if (currentQuestionIndex < boss.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else if (isCorrect) {
      setGameStatus("won");
    } else {
      // Out of questions but didn't win or lose yet? 
      // This means they answered some wrong but survived. Still counts as a win for completing it!
      setGameStatus("won");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full animate-fade-in bg-background rounded-lg border border-border p-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg bg-secondary border border-border hover:border-gold hover:text-gold transition-colors text-foreground-muted"
          aria-label="Flee battle"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <div>
          <h3 className="text-sm font-bold text-foreground">RPG Battle: {topic}</h3>
          <p className="text-xs text-foreground-muted">Defeat the boss by answering correctly!</p>
        </div>
      </div>

      {/* Win/Loss Screens */}
      {gameStatus === "won" && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center animate-bounce-slight">
          <PartyPopper className="w-24 h-24 text-gold drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-pulse" />
          <div>
            <h2 className="text-3xl font-black text-gold mb-2 tracking-wide uppercase">CONGRATULATIONS!</h2>
            <p className="text-foreground-muted max-w-sm mx-auto text-sm">
              You have defeated {boss.name} and mastered the basics of {topic}!
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xl font-bold text-yellow-400 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/30">
              <span>+100</span>
              <Coins className="w-6 h-6" />
              <span>Coins Rewarded!</span>
            </div>
          </div>
          <button 
            onClick={async () => {
              if (claiming) return;
              setClaiming(true);
              
              // Fire confetti
              const duration = 2000;
              const end = Date.now() + duration;

              const frame = () => {
                confetti({
                  particleCount: 5,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0 },
                  colors: ['#FFD700', '#FFA500', '#FF4500', '#FFFFFF']
                });
                confetti({
                  particleCount: 5,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1 },
                  colors: ['#FFD700', '#FFA500', '#FF4500', '#FFFFFF']
                });

                if (Date.now() < end) {
                  requestAnimationFrame(frame);
                }
              };
              frame();

              try {
                await fetch('/api/rewards/claim', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ amount: 100, reason: `Won Mini-Game: ${topic}` })
                });
                router.refresh();
              } catch (err) {
                console.error("Failed to claim reward:", err);
              }
              
              setTimeout(() => {
                onWin();
              }, 1500);
            }}
            disabled={claiming}
            className={`px-6 py-3 bg-gold text-background font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] ${claiming ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
          >
            {claiming ? "Claiming..." : "Claim Rewards & Add Quest"}
          </button>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
          <Skull className="w-20 h-20 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
          <div>
            <h2 className="text-2xl font-black text-red-500 mb-2">DEFEATED!</h2>
            <p className="text-foreground-muted max-w-sm mx-auto">{boss.name} overpowered your intellect. Rest and study before trying again.</p>
          </div>
          <button 
            onClick={onCancel}
            className="px-6 py-3 bg-secondary text-foreground font-bold rounded-lg border border-border hover:bg-secondary/80 transition-colors"
          >
            Flee & Rest
          </button>
        </div>
      )}

      {/* Battle Screen */}
      {gameStatus === "playing" && (
        <div className="flex-1 flex flex-col mt-4 overflow-y-auto pr-1">
          {/* Battle Arena */}
          <div className="flex justify-between items-end mb-6 px-2">
            {/* Player */}
            <div className="flex flex-col items-center space-y-2 w-1/3">
              <div className="w-full bg-secondary rounded-full h-3 border border-border overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-500" 
                  style={{ width: `${playerHp}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Heart className="w-4 h-4 text-green-500" />
                Player HP
              </div>
            </div>

            {/* VS */}
            <div className="text-xl font-black text-gold/50 italic mb-2">VS</div>

            {/* Boss */}
            <div className="flex flex-col items-center space-y-2 w-1/3">
              <div className="w-full bg-secondary rounded-full h-3 border border-border overflow-hidden flex justify-end">
                <div 
                  className="bg-red-500 h-full transition-all duration-500" 
                  style={{ width: `${(monsterHp / boss.hp) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Sword className="w-4 h-4 text-red-500" />
                {boss.name}
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-xs text-foreground-muted italic mb-3">"{boss.description}"</p>
            <div className="bg-secondary/50 border border-border rounded-xl p-5 shadow-inner">
              <p className="font-medium text-foreground text-sm leading-relaxed">
                <span className="text-gold font-bold mr-2">Q:</span>
                {currentQuestion.question}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQuestion.correctIndex;
              
              let btnClass = "p-4 text-left rounded-xl border border-border bg-secondary/30 hover:bg-secondary/80 transition-all text-sm font-medium text-foreground flex items-center justify-between";
              
              if (showExplanation) {
                if (isCorrectOption) {
                  btnClass = "p-4 text-left rounded-xl border border-green-500/50 bg-green-500/10 text-green-400 font-bold flex items-center justify-between";
                } else if (isSelected && !isCorrectOption) {
                  btnClass = "p-4 text-left rounded-xl border border-red-500/50 bg-red-500/10 text-red-400 flex items-center justify-between";
                } else {
                  btnClass = "p-4 text-left rounded-xl border border-border bg-secondary/10 opacity-50 text-foreground-muted flex items-center justify-between";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={showExplanation}
                  className={btnClass}
                >
                  <div className="flex items-start gap-3">
                    <span className="opacity-50 mt-0.5">{String.fromCharCode(65 + idx)}.</span>
                    <span>{option}</span>
                  </div>
                  {showExplanation && isCorrectOption && <Shield className="w-5 h-5 text-green-500 shrink-0" />}
                  {showExplanation && isSelected && !isCorrectOption && <Skull className="w-5 h-5 text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Area */}
          {showExplanation && (
            <div className={`p-4 rounded-xl border mb-4 animate-fade-in ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <h4 className={`font-bold text-sm mb-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? 'CRITICAL HIT!' : 'YOU TOOK DAMAGE!'}
              </h4>
              <p className="text-sm text-foreground-muted leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="w-full p-4 rounded-xl bg-gold text-background font-bold hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.2)] animate-pulse-slow"
            >
              {currentQuestionIndex < boss.questions.length - 1 ? "Next Attack" : "Finish Battle"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
