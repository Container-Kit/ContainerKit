export const OUTPUT_FORMAT_FLAG = {
    FORMAT: '--format'
} as const;

export const DEBUG_FLAG = {
    DEBUG: '--debug'
} as const;

export const OUTPUT_FORMAT = {
    // Format of the output (values: json, table, yaml; default: table)
    JSON: 'json',
    TABLE: 'table',
    YAML: 'yaml'
} as const;
