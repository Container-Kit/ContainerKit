import type { Snippet } from 'svelte';
import type { ButtonProps } from '../button/index.js';
import type { UseClipboard } from '../../../hooks/use-clipboard.svelte.js';
import type { WithChildren, WithoutChildren } from 'bits-ui';

export type CopyButtonPropsWithoutHTML = WithChildren<
	Pick<ButtonProps, 'size' | 'variant'> & {
		ref?: HTMLButtonElement | null;
		text: string;
		icon?: Snippet<[]>;
		animationDuration?: number;
		onCopy?: (status: UseClipboard['status']) => void;
	}
>;

export type CopyButtonProps = CopyButtonPropsWithoutHTML &
	WithoutChildren<Omit<ButtonProps, 'size' | 'variant' | 'ref'>>;
