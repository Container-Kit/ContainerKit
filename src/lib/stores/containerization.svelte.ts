import { FiniteStateMachine } from 'runed';
import { UseBoolean } from '$lib/stores/hooks/use-boolean.svelte';

type MyStates = 'running' | 'stopped';
type MyEvents = 'toggle' | 'stop' | 'start';

export let isContainerizationActive = new UseBoolean(false);
