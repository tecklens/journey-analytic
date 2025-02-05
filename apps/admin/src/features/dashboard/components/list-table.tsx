import {Card, CardContent, CardHeader} from "@admin/components/ui/card.tsx";
import {IconArrowRight} from "@tabler/icons-react";

export default function ListTable({title, title2, data}: {
    title: string,
    title2: string,
    data: { key: string, value: number, ratio: number }[]
}) {
    return (
        <Card>
            <CardHeader className={'font-semibold grid grid-cols-7 pb-0'}>
                <div className={'col-span-5'}>{title}</div>
                <div className={'col-span-2 text-center'}>{title2}</div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6">
                <div className={'flex flex-col gap-1'}>
                    {data?.map(e => (
                        <div key={e.key} className={'grid grid-cols-7 gap-1'}>
                            <div className={'col-span-5 inline-flex gap-1'}>
                                <img src={`/images/browser/blackberry.png`} alt={'icon'} className={'h-5 w-5'}/>
                                <span>{e.key}</span>
                            </div>
                            <div className={'col-span-2 inline-flex justify-center'}>
                                <div className={'w-16 font-semibold text-center'}>{e.value}</div>
                                <div className={'w-16 text-center border-l border-gray-400 relative'}>
                                    <span>{e.ratio}%</span>
                                    <div className={`bg-opacity-20 bg-blue-600 absolute top-0 left-0 h-full`}
                                         style={{width: `${e.ratio}%`}}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={'flex justify-center items-center gap-2 cursor-pointer'}>More <IconArrowRight size={14}
                                                                                                              className={'mt-0.5'}/>
                </div>
            </CardContent>
        </Card>
    )
}