<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { arch } from '@tauri-apps/plugin-os';
    import { toast } from 'svelte-sonner';
    import { pullImage } from '$lib/services/containerization/images';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import CloudDownload from '@lucide/svelte/icons/cloud-download';
    import Check from '@lucide/svelte/icons/check';
    import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
    import { Input } from '$lib/components/ui/input/index.js';
    import { Switch } from '$lib/components/ui/switch/index.js';
    import { type PullImageDetails, PullImageSchema, type PullImageValidatedDataType } from '$lib/schemas/images';
    import { slide } from "svelte/transition";

    type Props = {
        show: boolean;
    };

    type PullImageDetailsWithState = PullImageDetails & {
        pulling: 'none' | 'progress' | 'done'
    };

    let { show = $bindable(false) }: Props = $props();

    const defaultImageDetails: PullImageDetailsWithState = {
        name: "",
        tag: "latest",
        arch: arch(),
        platform: "",
        scheme: "auto",
        debug: false,
        pulling: 'none'
    }

    let validatedImagePullData: PullImageValidatedDataType | null = $state(null)

    let imageDetails = $state<PullImageDetailsWithState>({...defaultImageDetails});

    let isDisabled = $derived(imageDetails.pulling !== 'none')

    async function initiateImagePull() {
        imageDetails.pulling = 'progress'
        validatedImagePullData = PullImageSchema.safeParse(imageDetails)
        if (!validatedImagePullData.success) {
            imageDetails.pulling = 'none'
            console.log(JSON.stringify(validatedImagePullData.error, null, 2));
            return toast.error(`Error while validating ${validatedImagePullData.error.issues.map((issue) => issue.path.join('.')).join(', ')}`)
        }

        const options = ['--arch', imageDetails.arch, '--scheme', imageDetails.scheme];

        if (imageDetails.platform) {
            options.push('--platform', imageDetails.platform);
            toast.warning('Platform and arch both specified. Platform will take precedence over arch.');
        }

        if (imageDetails.debug) {
            options.push('--debug');
        }

        options.push(`${imageDetails.name}:${imageDetails.tag ?? 'latest'}`);

        // TODO: Handle error.
        await pullImage(options)

        imageDetails.pulling = 'done'

        toast.success('Success', {
            description: `Successfully pulled ${imageDetails.name}:${imageDetails.tag} image.`
        })

        setTimeout(() => {
            show = false;
            validatedImagePullData = null
            imageDetails = {...defaultImageDetails}
        }, 1500)
    }
</script>

<Dialog.Root open={show} onOpenChange={(val) => (show = val)}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Pull Image</Dialog.Title>
            <Dialog.Description>Download new container images from any source</Dialog.Description>
        </Dialog.Header>

        {#if isDisabled}
            <div class="flex flex-col" transition:slide>
                <Alert.Root class={[imageDetails.pulling === 'progress' && 'text-indigo-500', imageDetails.pulling === 'done' && "text-green-500"]}>
                    {#if imageDetails.pulling === 'done'}
                        <CheckCircle2Icon />
                        <Alert.Title>Success! Your {imageDetails.name} image have been pulled</Alert.Title>
                    {:else}
                        <Spinner />
                        <Alert.Title>Please wait while we are pulling your {imageDetails.name} image.</Alert.Title>
                    {/if}
                </Alert.Root>
            </div>
        {/if}
        <form onsubmit={initiateImagePull} onchange={() => validatedImagePullData = PullImageSchema.safeParse(imageDetails)}>
            <Field.Set>
                <Field.Group>
                    <div class="grid grid-cols-2 gap-4">
                        <Field.Field>
                            <Field.Label for="name">Image Name (or link)</Field.Label>
                            <Input required disabled={isDisabled} autocorrect="off" type="text" bind:value={imageDetails.name} id="name" placeholder="redis" />
                            <Field.Description>e.g. `redis`, `docker.io/redis`</Field.Description>
                            {#if validatedImagePullData?.error?.issues}
                                {@const errors = validatedImagePullData.error.issues.filter((issue) => issue.path.join('.') === 'name')}
                                {#each errors as error}
                                    <Field.Error>
                                        {error.message}
                                    </Field.Error>
                                {/each}
                            {/if}
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="tag">Image Tag (or version)</Field.Label>
                            <Input disabled={isDisabled} bind:value={imageDetails.tag} id="tag" placeholder="latest" />
                            <Field.Description>e.g. latest, 8.1</Field.Description>
                            {#if validatedImagePullData?.error?.issues}
                                {@const errors = validatedImagePullData.error.issues.filter((issue) => issue.path.join('.') === 'tag')}
                                {#each errors as error}
                                    <Field.Error>
                                        {error.message}
                                    </Field.Error>
                                {/each}
                            {/if}
                        </Field.Field>
                    </div>

                    <Field.Set>
                        <Field.Label for="scheme">Connection Scheme</Field.Label>
                        <Field.Description> Scheme to use when connecting to the container registry</Field.Description>
                        {#if validatedImagePullData?.error?.issues}
                            {@const errors = validatedImagePullData.error.issues.filter((issue) => issue.path.join('.') === 'scheme')}
                            {#each errors as error}
                                <Field.Error>
                                    {error.message}
                                </Field.Error>
                            {/each}
                        {/if}
                        <RadioGroup.Root disabled={isDisabled} id="scheme" bind:value={imageDetails.scheme}>
                            <Field.Label for="auto-scheme">
                                <Field.Field orientation="horizontal">
                                    <Field.Content>
                                        <Field.Title>Auto</Field.Title>
                                    </Field.Content>
                                    <RadioGroup.Item value="auto" id="auto-scheme" />
                                </Field.Field>
                            </Field.Label>
                            <Field.Label for="https-scheme">
                                <Field.Field orientation="horizontal">
                                    <Field.Content>
                                        <Field.Title>HTTPs</Field.Title>
                                    </Field.Content>
                                    <RadioGroup.Item value="https" id="https-scheme" />
                                </Field.Field>
                            </Field.Label>
                            <Field.Label for="http-scheme">
                                <Field.Field orientation="horizontal">
                                    <Field.Content>
                                        <Field.Title>HTTP</Field.Title>
                                    </Field.Content>
                                    <RadioGroup.Item value="http" id="http-scheme" />
                                </Field.Field>
                            </Field.Label>
                        </RadioGroup.Root>
                    </Field.Set>

                    <Field.Field orientation="horizontal">
                        <Field.Content>
                            <Field.Label for="debug">Debug</Field.Label>
                            <Field.Description>
                                Enable debug output [environment: CONTAINER_DEBUG]
                            </Field.Description>
                        </Field.Content>
                        <Switch disabled={isDisabled} bind:checked={imageDetails.debug} id="debug" />
                    </Field.Field>

                    <Button
                        variant={isDisabled ? 'outline' : 'default'}
                        disabled={isDisabled}
                        onclick={initiateImagePull}
                        class={[imageDetails.pulling === 'done' && 'bg-green-200 text-green-500']}>
                        {#if imageDetails.pulling === 'none'}
                            <CloudDownload /> Pull {imageDetails.name || 'image'}
                        {:else if imageDetails.pulling === 'progress'}
                            <Spinner /> Pulling { imageDetails.name }
                        {:else if imageDetails.pulling === 'done'}
                            <Check /> Pulled {imageDetails.name}
                        {/if}
                    </Button>
                </Field.Group>
            </Field.Set>
        </form>
    </Dialog.Content>
</Dialog.Root>