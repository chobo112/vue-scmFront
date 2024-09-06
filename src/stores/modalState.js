import { defineStore } from "pinia";

export const useModalStore = defineStore("modalState", () => {
    const modalState = ref(false);

    const setModalState = () => {
        modalState.value = !modalState.value;
    };

    return { modalState, setModalState };
});
export const useModalStore2 = defineStore("modalState2", () => {
    const modalState2 = ref(false);

    const setModalState2 = () => {
        modalState2.value = !modalState2.value;
    };

    return { modalState2, setModalState2 };
});
export const useModalStore3 = defineStore("modalState3", () => {
    const modalState3 = ref(false);

    const setModalState3 = () => {
        modalState3.value = !modalState3.value;
    };

    return { modalState3, setModalState3 };
});
