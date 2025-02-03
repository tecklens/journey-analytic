import {Card, CardContent, CardHeader, CardTitle} from "@admin/components/ui/card.tsx";
import AnimatedNumber from "@admin/components/custom/animated-number.tsx";
import {IconTrendingUp} from "@tabler/icons-react";

export default function GeneralParameterCard({title, value, ratioIncr}: {
    title: string,
    value: number,
    ratioIncr: number
}) {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'><AnimatedNumber value={value}/></div>
                <p className='text-xs text-green-600 inline-flex gap-1'>
                    <IconTrendingUp size={14} color={'green'} />
                    <span>{ratioIncr}%</span>
                </p>
            </CardContent>
        </Card>
    )
}