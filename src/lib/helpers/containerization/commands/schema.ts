export type OptionDef = {
    key: string; // internal key name
    flags: string[]; // flags as they appear on CLI (prefer long flag last)
    description?: string;
    takesValue?: boolean; // expects a value
    multiple?: boolean; // accepts multiple values
    default?: unknown;
    choices?: readonly string[]; // allowed values
    env?: string; // related environment var if any
};

export type CommandDef = {
    name: string; // e.g. 'container'
    sub?: string | string[]; // if command has a fixed subcommand like 'image'
    description?: string;
    options?: readonly OptionDef[];
};

export const COMMON_OPTIONS = {
    DEBUG: { key: 'debug', flags: ['--debug'], description: 'Enable debug output' } as OptionDef,
    FORMAT: {
        key: 'format',
        flags: ['--format'],
        takesValue: true,
        choices: ['json', 'table', 'yaml'],
        description: 'Output format'
    } as OptionDef
} as const;

// Minimal command registry for commands used in services. Add more entries as needed.
export const COMMANDS: Record<string, CommandDef> = {
    'container.list': {
        name: 'container',
        sub: 'list',
        description: 'List containers',
        options: [COMMON_OPTIONS.FORMAT, COMMON_OPTIONS.DEBUG]
    },
    'container.start': {
        name: 'container',
        sub: 'start',
        description: 'Start container',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.stop': {
        name: 'container',
        sub: 'stop',
        description: 'Stop container',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.rm': {
        name: 'container',
        sub: 'rm',
        description: 'Remove container',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.inspect': {
        name: 'container',
        sub: 'inspect',
        description: 'Inspect container',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.logs': {
        name: 'container',
        sub: 'logs',
        description: 'Container logs',
        options: [COMMON_OPTIONS.DEBUG]
    },

    // image
    'container.image.list': {
        name: 'container',
        sub: ['image', 'ls'],
        description: 'Image commands (list shown below)',
        options: [COMMON_OPTIONS.FORMAT, COMMON_OPTIONS.DEBUG]
    },
    'container.image.pull': {
        name: 'container',
        sub: ['image', 'pull'],
        description: 'Pull an image',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.image.delete': {
        name: 'container',
        sub: 'image',
        description: 'Delete one or more images',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.image.inspect': {
        name: 'container',
        sub: 'image',
        description: 'Inspect image',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.image.load': {
        name: 'container',
        sub: 'image',
        description: 'Load image from tar',
        options: [COMMON_OPTIONS.DEBUG]
    },
    'container.image.save': {
        name: 'container',
        sub: 'image',
        description: 'Save image to tar',
        options: [COMMON_OPTIONS.DEBUG]
    }
} as const;

// Small helper to build argv safely from a CommandDef and values
export function buildArgs(
    def: CommandDef,
    opts: Record<string, any> = {},
    positional: string[] = []
): string[] {
    const argv: string[] = [];
    argv.push(def.name);
    if (def.sub) {
        if (Array.isArray(def.sub)) {
            argv.push(...def.sub);
        } else {
            argv.push(def.sub);
        }
    }
    (def.options || []).forEach((opt) => {
        const val = opts[opt.key];
        if (val === undefined || val === null) return;
        // prefer long flag if present
        const flag = opt.flags[opt.flags.length - 1];

        if (opt.takesValue) {
            if (Array.isArray(val)) {
                val.forEach((v) => {
                    argv.push(flag, String(v));
                });
            } else {
                argv.push(flag, String(val));
            }
        } else {
            // bool flag
            if (val === true) argv.push(flag);
        }
    });
    console.log('argv', argv);
    // append positional args (already separate list)
    return argv.concat(positional);
}
