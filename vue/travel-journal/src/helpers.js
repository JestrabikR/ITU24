/* Autor: Radek Jestrabik (xjestr04) */

export function formatDate(dateString) {
    const dateParts = dateString.split('-');
    return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
}

export const TripStatus = {
    PAST: 'past',
    CURRENT: 'current',
    FUTURE: 'future'
};

export const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};