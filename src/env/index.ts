const REMOTE_BASE_URL: string = import.meta.env.VITE_BASE_URL;
const REMOTE_BASE_API: string = REMOTE_BASE_URL + "/api/";
const REMOTE_IMAGES_URL: string = REMOTE_BASE_URL + '/images/';

const APP_ENV = {
    REMOTE_BASE_URL,
    REMOTE_BASE_API,
    REMOTE_IMAGES_URL,
}

export { APP_ENV };
