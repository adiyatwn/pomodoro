import { writable } from 'svelte/store';

export type SessionType = 'pomodoro' | 'shortBreak' | 'longBreak';
export type SessionStatus = 'idle' | 'running' | 'paused';

interface Session {
    type: SessionType;
    duration: number;
    remaining: number;
    status: SessionStatus;
    completedAt?: Date;
}

interface TimerState {
    currentSession: Session;
    completedSessions: Session[];
    settings: {
        pomodoroDuration: number;
        shortBreakDuration: number;
        longBreakDuration: number;
        longBreakInterval: number;
    };
}

const DEFAULT_SETTINGS = {
    pomodoroDuration: 25 * 60, // 25 minutes in seconds
    shortBreakDuration: 5 * 60, // 5 minutes in seconds
    longBreakDuration: 15 * 60, // 15 minutes in seconds
    longBreakInterval: 4, // Take a long break after 4 pomodoros
};

const initialState: TimerState = {
    currentSession: {
        type: 'pomodoro',
        duration: DEFAULT_SETTINGS.pomodoroDuration,
        remaining: DEFAULT_SETTINGS.pomodoroDuration,
        status: 'idle',
    },
    completedSessions: [],
    settings: DEFAULT_SETTINGS,
};

function createTimerStore() {
    const { subscribe, set, update } = writable<TimerState>(initialState);

    return {
        subscribe,
        startTimer: () => {
            update(state => ({
                ...state,
                currentSession: {
                    ...state.currentSession,
                    status: 'running',
                },
            }));
        },
        pauseTimer: () => {
            update(state => ({
                ...state,
                currentSession: {
                    ...state.currentSession,
                    status: 'paused',
                },
            }));
        },
        resetTimer: () => {
            update(state => ({
                ...state,
                currentSession: {
                    ...state.currentSession,
                    remaining: state.currentSession.duration,
                    status: 'idle',
                },
            }));
        },
        updateRemaining: (seconds: number) => {
            update(state => ({
                ...state,
                currentSession: {
                    ...state.currentSession,
                    remaining: seconds,
                },
            }));
        },
        completeSession: () => {
            update(state => {
                const completedSession = {
                    ...state.currentSession,
                    status: 'idle' as SessionStatus,
                    completedAt: new Date(),
                };
                
                const nextSessionType = state.currentSession.type === 'pomodoro'
                    ? (state.completedSessions.filter(s => s.type === 'pomodoro').length + 1) % state.settings.longBreakInterval === 0
                        ? 'longBreak'
                        : 'shortBreak'
                    : 'pomodoro';

                const nextDuration = state.settings[
                    nextSessionType === 'pomodoro'
                        ? 'pomodoroDuration'
                        : nextSessionType === 'shortBreak'
                        ? 'shortBreakDuration'
                        : 'longBreakDuration'
                ];

                return {
                    ...state,
                    currentSession: {
                        type: nextSessionType,
                        duration: nextDuration,
                        remaining: nextDuration,
                        status: 'idle',
                    },
                    completedSessions: [...state.completedSessions, completedSession],
                };
            });
        },
        updateSettings: (settings: Partial<TimerState['settings']>) => {
            update(state => {
                const newSettings = { ...state.settings, ...settings };
                const currentType = state.currentSession.type;
                const newDuration = newSettings[
                    currentType === 'pomodoro'
                        ? 'pomodoroDuration'
                        : currentType === 'shortBreak'
                        ? 'shortBreakDuration'
                        : 'longBreakDuration'
                ];

                return {
                    ...state,
                    settings: newSettings,
                    currentSession: {
                        ...state.currentSession,
                        duration: newDuration,
                        remaining: newDuration,
                        status: 'idle'
                    }
                };
            });
        },
    };
}

export const timerStore = createTimerStore(); 