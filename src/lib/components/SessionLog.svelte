<script lang="ts">
    import { timerStore } from '$lib/stores/timerStore';
    import type { SessionType } from '$lib/stores/timerStore';

    function formatDate(date: Date): string {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    }

    function getSessionTypeLabel(type: SessionType): string {
        switch (type) {
            case 'pomodoro':
                return 'Focus Session';
            case 'shortBreak':
                return 'Short Break';
            case 'longBreak':
                return 'Long Break';
            default:
                return type;
        }
    }

    function getSessionTypeColor(type: SessionType): string {
        switch (type) {
            case 'pomodoro':
                return 'text-red-500';
            case 'shortBreak':
                return 'text-green-500';
            case 'longBreak':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    }
</script>

<div class="w-full max-w-md mx-auto p-4">
    <h2 class="text-xl font-bold mb-4">Session History</h2>
    <div class="space-y-2">
        {#if $timerStore.completedSessions.length === 0}
            <p class="text-gray-500 text-center py-4">No completed sessions yet</p>
        {:else}
            {#each $timerStore.completedSessions.slice().reverse() as session}
                <div class="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <span class="font-medium {getSessionTypeColor(session.type)}">
                            {getSessionTypeLabel(session.type)}
                        </span>
                        <p class="text-sm text-gray-500">
                            {formatDate(session.completedAt!)}
                        </p>
                    </div>
                    <div class="text-sm text-gray-600">
                        {Math.floor(session.duration / 60)} min
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div> 