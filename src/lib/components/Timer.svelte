<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { timerStore } from '$lib/stores/timerStore';
    import type { SessionType } from '$lib/stores/timerStore';

    let intervalId: number;
    let audio: HTMLAudioElement;

    $: minutes = Math.floor($timerStore.currentSession.remaining / 60);
    $: seconds = $timerStore.currentSession.remaining % 60;
    $: formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    $: progress = ($timerStore.currentSession.duration - $timerStore.currentSession.remaining) / $timerStore.currentSession.duration * 100;

    function startTimer() {
        if ($timerStore.currentSession.status === 'running') return;
        timerStore.startTimer();
        intervalId = window.setInterval(() => {
            if ($timerStore.currentSession.remaining <= 0) {
                completeSession();
                return;
            }
            timerStore.updateRemaining($timerStore.currentSession.remaining - 1);
        }, 1000);
    }

    function pauseTimer() {
        if ($timerStore.currentSession.status !== 'running') return;
        timerStore.pauseTimer();
        clearInterval(intervalId);
    }

    function resetTimer() {
        clearInterval(intervalId);
        timerStore.resetTimer();
    }

    function completeSession() {
        clearInterval(intervalId);
        audio.play();
        timerStore.completeSession();
    }

    function getSessionColor(type: SessionType): string {
        switch (type) {
            case 'pomodoro':
                return 'bg-red-500';
            case 'shortBreak':
                return 'bg-green-500';
            case 'longBreak':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    }

    onMount(() => {
        audio = new Audio('/notification.mp3');
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<div class="flex flex-col items-center justify-center p-8">
    <div class="w-full max-w-md">
        <div class="relative">
            <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                    class="h-full transition-all duration-1000 ease-linear {getSessionColor($timerStore.currentSession.type)}"
                    style="width: {progress}%"
                ></div>
            </div>
        </div>

        <div class="mt-8 text-center">
            <h2 class="text-2xl font-bold mb-2">
                {$timerStore.currentSession.type === 'pomodoro' ? 'Focus Time' :
                 $timerStore.currentSession.type === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </h2>
            <div class="text-6xl font-mono font-bold my-8">{formattedTime}</div>

            <div class="flex justify-center gap-4">
                {#if $timerStore.currentSession.status === 'running'}
                    <button
                        on:click={pauseTimer}
                        class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        Pause
                    </button>
                {:else}
                    <button
                        on:click={startTimer}
                        class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Start
                    </button>
                {/if}
                <button
                    on:click={resetTimer}
                    class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    </div>
</div> 