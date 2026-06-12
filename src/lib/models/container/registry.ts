export type RegistryLoginParams = {
    username: string;
    password: string;
    scheme?: 'http' | 'https' | 'auto';
    registry: string;
};

export type RegistryLogoutParams = {
    registry: string;
};

export type Registry = {
    name: string;
    url: string;
    loggedIn?: boolean;
};
