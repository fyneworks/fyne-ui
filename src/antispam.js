export const Antispam = ()=> {
    const token = window.fwx_grecaptcha_token || 'fwx_grecaptcha_not_configured';
    return {
        ['g-recaptcha-response-v3']: token
    };
};