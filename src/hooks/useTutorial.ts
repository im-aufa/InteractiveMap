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
                        title: "Filters",
                        description: "Filter programs by Category, Year, or Status using this menu.",
                        side: "bottom",
                        align: "start",
                    },
                },
                {
                    element: "#search-container",
                    popover: {
                        title: "Search",
                        description: "Find specific programs by typing keywords here.",
                        side: "bottom",
                        align: "start",
                    },
                },
                {
                    element: "#theme-toggle",
                    popover: {
                        title: "Theme Information",
                        description: "Switch between Dark and Light mode for better visibility.",
                        side: "left",
                        align: "start",
                    },
                },
                {
                    element: "#zoom-controls",
                    popover: {
                        title: "Map Controls",
                        description: "Zoom in, zoom out, or reset the map view here.",
                        side: "left",
                        align: "start",
                    },
                },
            ],
        });

        driverObj.drive();
    };

    return { startTutorial };
};
