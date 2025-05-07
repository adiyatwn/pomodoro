<script lang="ts">
    import { timerStore } from '$lib/stores/timerStore';
    import { onMount } from 'svelte';

    let showSettings = false;
    let localSettings = {
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4
    };

    onMount(() => {
        // Initialize local settings with current store values
        localSettings = {
            pomodoroDuration: $timerStore.settings.pomodoroDuration / 60,
            shortBreakDuration: $timerStore.settings.shortBreakDuration / 60,
            longBreakDuration: $timerStore.settings.longBreakDuration / 60,
            longBreakInterval: $timerStore.settings.longBreakInterval
        };
    });

    function saveSettings() {
        timerStore.updateSettings({
            pomodoroDuration: localSettings.pomodoroDuration * 60,
            shortBreakDuration: localSettings.shortBreakDuration * 60,
            longBreakDuration: localSettings.longBreakDuration * 60,
            longBreakInterval: localSettings.longBreakInterval
        });
        showSettings = false;
    }

    function validateInput(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
</script>

<div class="w-full max-w-md mx-auto p-4">
    <button
        on:click={() => showSettings = !showSettings}
        class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
        Settings
    </button>

    {#if showSettings}
        <div class="mt-4 bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Timer Settings</h3>
            
            <div class="space-y-4">
                <div>
                    <label for="pomodoro" class="block text-sm font-medium text-gray-700">Focus Duration (minutes)</label>
                    <input
                        type="number"
                        id="pomodoro"
                        bind:value={localSettings.pomodoroDuration}
                        on:change={() => localSettings.pomodoroDuration = validateInput(localSettings.pomodoroDuration, 1, 60)}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="1"
                        max="60"
                    />
                </div>

                <div>
                    <label for="shortBreak" class="block text-sm font-medium text-gray-700">Short Break Duration (minutes)</label>
                    <input
                        type="number"
                        id="shortBreak"
                        bind:value={localSettings.shortBreakDuration}
                        on:change={() => localSettings.shortBreakDuration = validateInput(localSettings.shortBreakDuration, 1, 30)}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="1"
                        max="30"
                    />
                </div>

                <div>
                    <label for="longBreak" class="block text-sm font-medium text-gray-700">Long Break Duration (minutes)</label>
                    <input
                        type="number"
                        id="longBreak"
                        bind:value={localSettings.longBreakDuration}
                        on:change={() => localSettings.longBreakDuration = validateInput(localSettings.longBreakDuration, 1, 60)}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="1"
                        max="60"
                    />
                </div>

                <div>
                    <label for="interval" class="block text-sm font-medium text-gray-700">Long Break Interval (focus sessions)</label>
                    <input
                        type="number"
                        id="interval"
                        bind:value={localSettings.longBreakInterval}
                        on:change={() => localSettings.longBreakInterval = validateInput(localSettings.longBreakInterval, 1, 10)}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="1"
                        max="10"
                    />
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button
                    on:click={() => showSettings = false}
                    class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    on:click={saveSettings}
                    class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    {/if}
</div> 