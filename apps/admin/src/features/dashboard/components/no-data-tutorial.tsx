import {Tabs, TabsContent, TabsList, TabsTrigger} from "@admin/components/ui/tabs.tsx";
import {IconBrandJavascript, IconBrandNextjs, IconBrandReact} from "@tabler/icons-react";

export default function NoDataTutorial() {
    return (
        <div className={'flex justify-center'}>
            <div className={'max-w-screen-lg w-full px-4 flex flex-col gap-3 md:gap-4'}>
                <div className={'font-semibold text-xl text-center'}>You don't have data yet, please follow the
                    instructions
                </div>
                <Tabs defaultValue={'react'} className={''}>
                    <TabsList className={'grid w-full grid-cols-3'}>
                        <TabsTrigger value={'react'}><IconBrandReact size={18} className={'mr-1'}/> React</TabsTrigger>
                        <TabsTrigger value={'nextjs'}><IconBrandNextjs size={18}
                                                                       className={'mr-1'}/>Next.js</TabsTrigger>
                        <TabsTrigger value={'javascript'}><IconBrandJavascript size={18}
                                                                               className={'mr-1'}/>Javascript</TabsTrigger>
                    </TabsList>
                    <TabsContent value={'react'}>
                    </TabsContent>
                    <TabsContent value={'nextjs'}></TabsContent>
                    <TabsContent value={'javascript'}></TabsContent>
                </Tabs>
            </div>
        </div>
    )
}