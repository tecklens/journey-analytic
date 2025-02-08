import {Header} from '@admin/components/layout/header'
import {Main} from '@admin/components/layout/main'
import {TopNav} from '@admin/components/layout/top-nav'
import {ProfileDropdown} from '@admin/components/profile-dropdown'
import {Search} from '@admin/components/search'
import {ThemeSwitch} from '@admin/components/theme-switch'
import {InteractiveAreaChart} from "@admin/components/charts/interactive-area-chart.tsx";
import ListTable from "@admin/features/dashboard/components/list-table.tsx";
import GeoChart from "@admin/components/charts/geo-chart.tsx";
import {TooltipChart} from "@admin/components/charts/tooltip-chart.tsx";
import GeneralParameterCard from "@admin/features/dashboard/components/general-parameter.card.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select"
import {useWebsiteQuery} from "@admin/api/project/website-query.ts";
import {useAuth} from "@admin/hooks/use-auth.ts";
import NoDataTutorial from "@admin/features/dashboard/components/no-data-tutorial.tsx";

export default function Dashboard() {
  const auth = useAuth()
  const website = useWebsiteQuery({projectId: auth.user?.currentProjectId});
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav/>
        <div className='ml-auto flex items-center space-x-4'>
          <Search/>
          <ThemeSwitch/>
          <ProfileDropdown/>
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className={'flex flex-col gap-4 m-4'}>
        {website.isLoading ?
          <div></div>
          : website.data?.haveData ?
            <>
              <div className='mb-2 flex items-center justify-between space-y-2'>
                <div className={'inline-flex gap-1 md:gap-2 items-end'}>
                  <h1 className='text-2xl font-bold tracking-tight inline-flex gap-1 items-center'>
                    <img src={'/images/favicon.svg'} alt={'logo'} className={'h-7 w-7'}/>
                    <span>Journey Analysis</span>
                  </h1>
                  <div className={'inline-flex items-center gap-1 text-sm'}>
                    <div className={'bg-green-500 w-2 h-2 rounded-full'}></div>
                    <span>3 current visitors</span>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Last 24 hours"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <GeneralParameterCard
                  title={'Views'}
                  value={5340}
                  ratioIncr={34}
                />
                <GeneralParameterCard
                  title={'Visits'}
                  value={4736432}
                  ratioIncr={34}
                />
                <GeneralParameterCard
                  title={'Visitors'}
                  value={512312}
                  ratioIncr={34}
                />
                <GeneralParameterCard
                  title={'Visit duration'}
                  value={123}
                  ratioIncr={34}
                />
              </div>
              <div className=''>
                <InteractiveAreaChart/>
              </div>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <ListTable
                  title={'Browser'}
                  title2={'Visitors'}
                  data={[
                    {
                      key: '/',
                      value: 137,
                      ratio: 47
                    },
                    {
                      key: '/pricing',
                      value: 353,
                      ratio: 12
                    },
                    {
                      key: '/docs',
                      value: 338,
                      ratio: 12
                    },
                  ]}
                />
                <ListTable
                  title={'Referrers'}
                  title2={'Views'}
                  data={[
                    {
                      key: '/',
                      value: 137,
                      ratio: 47
                    },
                    {
                      key: '/pricing',
                      value: 353,
                      ratio: 12
                    },
                    {
                      key: '/docs',
                      value: 338,
                      ratio: 12
                    },
                  ]}
                />
                <ListTable
                  title={'Referrers'}
                  title2={'Views'}
                  data={[
                    {
                      key: '/',
                      value: 137,
                      ratio: 47
                    },
                    {
                      key: '/pricing',
                      value: 353,
                      ratio: 12
                    },
                    {
                      key: '/docs',
                      value: 338,
                      ratio: 12
                    },
                  ]}
                />
                <ListTable
                  title={'Referrers'}
                  title2={'Views'}
                  data={[
                    {
                      key: '/',
                      value: 137,
                      ratio: 47
                    },
                    {
                      key: '/pricing',
                      value: 353,
                      ratio: 12
                    },
                    {
                      key: '/docs',
                      value: 338,
                      ratio: 12
                    },
                  ]}
                />
              </div>
              <GeoChart/>
              <TooltipChart/>
            </>
            : <NoDataTutorial/>}
      </Main>
    </>
  )
}
