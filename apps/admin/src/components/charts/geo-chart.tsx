import {Chart} from "react-google-charts";
import {Progress} from "@admin/components/ui/progress.tsx";
import {Separator} from "@admin/components/ui/separator.tsx";

export const data = [
    ["Country", "Popularity"],
    ["Germany", 200],
    ["United States", 300],
    ["Brazil", 400],
    ["Canada", 500],
    ["France", 600],
    ["RU", 700],
];

export default function GeoChart() {
    return (
        <div className={'w-full flex justify-center flex-col md:flex-row my-4'}>
            <div className={'w-full h-full min-h-[400px] override-geo-chart'}>
                <Chart
                    chartEvents={[
                        {
                            eventName: "select",
                            callback: ({chartWrapper}) => {
                                if (!chartWrapper) return;
                                const chart = chartWrapper.getChart();
                                const selection = chart.getSelection();
                                if (selection.length === 0) return;
                                const region = data[selection[0].row + 1];
                                console.log("Selected : " + region);
                            },
                        },
                    ]}
                    chartType="GeoChart"
                    width="100%"
                    height="100%"
                    data={data}
                />
            </div>
            <div className={'min-w-[300px] max-w-[400px] w-full flex flex-col gap-1'}>
                <div className={'flex w-full justify-between text-sm font-semibold'}>
                    <div>COUNTRY</div>
                    <div>ACTIVE USERS</div>
                </div>
                <Separator/>
                <div>
                    <div className={'flex w-full justify-between text-sm font-semibold'}>
                        <div>Vietnam</div>
                        <div>365</div>
                    </div>
                    <Progress value={60} className="w-full h-1"/>
                </div>
                <div>
                    <div className={'flex w-full justify-between text-sm font-semibold'}>
                        <div>United States</div>
                        <div>13</div>
                    </div>
                    <Progress value={20} className="w-full h-1"/>
                </div>
                <div>
                    <div className={'flex w-full justify-between text-sm font-semibold'}>
                        <div>Vietnam</div>
                        <div>365</div>
                    </div>
                    <Progress value={60} className="w-full h-1"/>
                </div>
                <div>
                    <div className={'flex w-full justify-between text-sm font-semibold'}>
                        <div>United States</div>
                        <div>13</div>
                    </div>
                    <Progress value={20} className="w-full h-1"/>
                </div>
            </div>
        </div>
    );
}
