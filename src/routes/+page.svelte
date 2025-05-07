<script lang="ts">
    import Timer from '$lib/components/Timer.svelte';
    import SessionLog from '$lib/components/SessionLog.svelte';
    import Settings from '$lib/components/Settings.svelte';
</script>

<svelte:head>
    <title>Pomodoro Timer</title>
</svelte:head>

<main class="min-h-screen bg-gray-100">
    <div class="container mx-auto py-8">
        <h1 class="text-3xl font-bold text-center mb-8">Pomodoro Timer</h1>
        <Timer />
        <Settings />
        <SessionLog />
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
</style>
