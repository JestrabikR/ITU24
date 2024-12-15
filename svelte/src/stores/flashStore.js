// Author: Ondřej Hruboš (xhrubo01)
// File: flashStore.js

import { writable } from "svelte/store";

export const flashMessage = writable(null);

export function setFlashMessage(message, type = "info") {
    if (!message) return;
    flashMessage.set({ message, type });

    // automatically clear the message after a timeout
    setTimeout(() => {
        flashMessage.set({ message: "", type: "info" });
    }, 3000);
}
