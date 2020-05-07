const { fwxcms_analytics } = window;

export const Analytics = (defaults)=> {
    const fynana = fwxcms_analytics && fwxcms_analytics().get();
    return Object.assign({}, defaults || {}, fynana || {});
};
