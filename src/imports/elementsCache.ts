export function cacheElements(...ids: string[]): {[k: string]: HTMLElement} {
    const elements: {[k: string]: HTMLElement} = {};

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            elements[id] = el;
        }
    });

    return elements;
}
