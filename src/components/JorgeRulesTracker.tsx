import React, { useState, useEffect } from 'react';
import { Check, X, ListChecks, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface Rule {
  id: string;
  text: string;
  status: 'success' | 'failed' | 'unanswered';
}

interface WeeklyRules {
  weekId: string;
  rules: Rule[];
}

export default function JorgeRulesTracker() {
  const [weeklyRules, setWeeklyRules] = useState<WeeklyRules[]>([]);
  const [currentWeekId, setCurrentWeekId] = useState<string>('');
  const [showAllRules, setShowAllRules] = useState(false);

  useEffect(() => {
    // Generate a week ID based on the current date
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const weekId = `Semana del ${startOfWeek.getDate()} de ${startOfWeek.toLocaleString('es-ES', { month: 'long' })}`;
    setCurrentWeekId(weekId);

    // Load saved rules from localStorage
    const savedData = localStorage.getItem('jorge_weekly_rules_v2');
    let currentWeeklyRules: WeeklyRules[] = savedData ? JSON.parse(savedData) : [];
    
    // Extract rules from setupData (Task 14 is Repaso de Normas)
    const setupData = localStorage.getItem('setup_14');
    let setupRules: Rule[] = [];
    
    if (setupData) {
      const lines = setupData.split('\n').filter(line => line.trim().length > 0);
      setupRules = lines.map((line, index) => ({
        id: `rule_setup_${index}`,
        text: line.replace(/^\d+[\.\-]?\s*/, '').trim(),
        status: 'unanswered'
      }));
    } else {
      setupRules = [
        { id: 'rule_default_1', text: 'Hablar sin gritar', status: 'unanswered' },
        { id: 'rule_default_2', text: 'Recoger los juguetes', status: 'unanswered' },
        { id: 'rule_default_3', text: 'Hacer la tarea antes de jugar', status: 'unanswered' }
      ];
    }

    // Find or create the current week
    let currentWeek = currentWeeklyRules.find(w => w.weekId === weekId);
    
    if (!currentWeek) {
      currentWeek = { weekId, rules: setupRules };
      currentWeeklyRules = [currentWeek, ...currentWeeklyRules.filter(w => w.weekId !== weekId)];
    } else {
      // Merge setup rules with existing rules for the current week
      const mergedRules = setupRules.map(setupRule => {
        const existingRule = currentWeek!.rules.find(r => r.text === setupRule.text);
        if (existingRule) {
          return { ...setupRule, status: existingRule.status, id: existingRule.id };
        }
        return setupRule;
      });
      
      currentWeek.rules = mergedRules;
      currentWeeklyRules = currentWeeklyRules.map(w => w.weekId === weekId ? currentWeek! : w);
    }

    setWeeklyRules(currentWeeklyRules);
    localStorage.setItem('jorge_weekly_rules_v2', JSON.stringify(currentWeeklyRules));
  }, []);

  const toggleRule = (weekId: string, ruleId: string, newStatus: 'success' | 'failed') => {
    const updatedWeeklyRules = weeklyRules.map(week => {
      if (week.weekId === weekId) {
        return {
          ...week,
          rules: week.rules.map(rule => 
            rule.id === ruleId ? { ...rule, status: newStatus } : rule
          )
        };
      }
      return week;
    });

    setWeeklyRules(updatedWeeklyRules);
    localStorage.setItem('jorge_weekly_rules_v2', JSON.stringify(updatedWeeklyRules));
  };

  if (weeklyRules.length === 0) return null;

  const currentWeek = weeklyRules.find(w => w.weekId === currentWeekId) || weeklyRules[0];
  if (!currentWeek) return null;

  const visibleRules = showAllRules ? currentWeek.rules : currentWeek.rules.slice(0, 2);
  const hasMoreRules = currentWeek.rules.length > 2;

  return (
    <div className="bg-white border-2 border-black rounded-3xl p-5 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <ListChecks size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold">Seguimiento de Normas</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Calendar size={14} />
          {currentWeek.weekId}
        </div>
      </div>

      <div className="space-y-3">
        {visibleRules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
            <span className={`flex-1 text-sm font-medium ${rule.status === 'success' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {rule.text}
            </span>
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={() => toggleRule(currentWeek.weekId, rule.id, 'success')}
                className={`p-1.5 rounded-lg transition-colors ${
                  rule.status === 'success'
                    ? 'bg-green-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                }`}
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => toggleRule(currentWeek.weekId, rule.id, 'failed')}
                className={`p-1.5 rounded-lg transition-colors ${
                  rule.status === 'failed'
                    ? 'bg-red-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                }`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMoreRules && (
        <button
          onClick={() => setShowAllRules(!showAllRules)}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
        >
          {showAllRules ? (
            <>Ocultar normas <ChevronUp size={16} /></>
          ) : (
            <>Ver {currentWeek.rules.length - 2} normas más <ChevronDown size={16} /></>
          )}
        </button>
      )}
    </div>
  );
}
