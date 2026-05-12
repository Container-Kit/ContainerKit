function getPortsFromHistory(manifestData) {
    const portSet = new Set();

    // Drill down into the specific OCI structure you provided
    const history = manifestData[0]?.variants?.[0]?.config?.history || [];

    history.forEach((layer: string) => {
        const cmd = layer.created_by || '';

        // Only process if the line is an exposé instruction
        if (cmd.includes('EXPOSE')) {
            // Regex explanation:
            // (\d+)      : Capture the port numbers
            // \/?        : Optional slash
            // (tcp|udp)? : Optional protocol
            const matches = cmd.matchAll(/(\d+)(?:\/(tcp|udp))?/g);

            for (const match of matches) {
                const port = match[1];
                const proto = match[2] || 'tcp'; // Default to tcp if not specified
                portSet.add(`${port}/${proto}`);
            }
        }
    });

    return Array.from(portSet);
}
