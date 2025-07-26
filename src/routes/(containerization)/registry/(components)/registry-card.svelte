<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js"
    import { Button } from '$lib/components/ui/button';
    import type { InsertRegistry } from '$lib/models/container';

    type Props = Required<InsertRegistry> & {
        isDefault: boolean;
        handleDeleteRegistry: () => void
    }

    let { isDefault, handleDeleteRegistry, ...registry }: Props = $props();
    let disabledActions: Record<string, boolean> = $state({
        login: false,
        setAsDefault: false,
        delete: false
    })

    async function handleRegistryLogin() {

    }

    async function handleRegistryLogout() {

    }

    async function handleSetAsDefaultRegistry() {

    }

</script>

<Card.Root>
    <Card.Header>
        <Card.Title>
            {registry.name}
        </Card.Title>
        <Card.Description class="truncate w-full">
            {registry.url}
        </Card.Description>
        <Card.Action>
            <Button variant={registry.loggedIn ? 'outline' : 'default'}>{registry.loggedIn ? 'Logout' : 'Login' }</Button>
        </Card.Action>
    </Card.Header>
    <Card.Content>
        <Card.Footer class="flex-col gap-2">
            <Button variant="destructive" class="w-full" onclick={handleDeleteRegistry}>Delete</Button>
            {#if isDefault}
                <Button class="w-full">Set as default</Button>
            {/if}
        </Card.Footer>
    </Card.Content>
</Card.Root>