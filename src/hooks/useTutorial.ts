import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useTutorial = () => {
    const startTutorial = () => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            stagePadding: 4,
            steps: [
                {
                    element: "#filter-toggle",
                    popover: {
                        title: "Filter Program",
                        description: "Filter program berdasarkan Kategori, Tahun, atau Status menggunakan menu ini.",
                        side: "bottom",
                        align: "start",
                    },
                },
                {
                    element: "#search-container",
                    popover: {
                        title: "Cari Program",
                        description: "Ketik nama program untuk mencari. Pilih dari daftar saran yang muncul untuk langsung menuju lokasi program.",
                        side: "bottom",
                        align: "start",
                    },
                },
                {
                    element: "#theme-toggle",
                    popover: {
                        title: "Mode Tampilan",
                        description: "Beralih antara mode Gelap dan Terang untuk kenyamanan tampilan.",
                        side: "left",
                        align: "start",
                    },
                },
                {
                    element: "#zoom-controls",
                    popover: {
                        title: "Kontrol Peta",
                        description: "Perbesar, perkecil, atau reset tampilan peta. Gunakan tombol GPS untuk menemukan lokasi Anda, dan tombol layer untuk beralih ke tampilan satelit.",
                        side: "left",
                        align: "start",
                    },
                },
                {
                    popover: {
                        title: "Marker & Cluster",
                        description: "Klik ikon marker di peta untuk melihat detail program. Jika beberapa program berdekatan, mereka akan dikelompokkan dalam cluster — klik cluster untuk memperbesar atau melihat daftar program.",
                    },
                },
                {
                    element: "#help-button",
                    popover: {
                        title: "Butuh Bantuan?",
                        description: "Klik tombol ini kapan saja untuk membuka tutorial ini kembali.",
                        side: "top",
                        align: "start",
                    },
                },
            ],
        });

        driverObj.drive();
    };

    return { startTutorial };
};
