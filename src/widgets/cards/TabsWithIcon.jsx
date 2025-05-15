// src/widgets/cards/TabsWithIcon.jsx
import React from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

export function TabsWithIcon({ tabs, onTabChange }) {
    const [activeTab, setActiveTab] = React.useState(tabs[0]?.value || "");

    const handleTabChange = (value) => {
        setActiveTab(value);
        if (onTabChange) {
            onTabChange(value);
        }
    };

    return (
        <Tabs value={activeTab} onChange={handleTabChange}>
            <TabsHeader>
                {tabs.map(({ label, value, icon: Icon }) => (
                    <Tab key={value} value={value}>
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-5 h-5" />}
                            {label}
                        </div>
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {tabs.map(({ value, content }) => (
                    <TabPanel key={value} value={value}>
                        {content}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}

export default TabsWithIcon;