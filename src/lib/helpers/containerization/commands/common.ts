export const OUTPUT_FLAG = '--format';
export const DEBUG_FORMAT_FLAG = '--debug';

export const OUTPUT_FORMAT_FLAG = {
    FORMAT: OUTPUT_FLAG
} as const;

export const DEBUG_FLAG = {
    DEBUG: DEBUG_FORMAT_FLAG
} as const;

export const OUTPUT_FORMAT = {
    // Format of the output (values: json, table, yaml; default: table)
    JSON: 'json',
    TABLE: 'table',
    YAML: 'yaml'
} as const;
