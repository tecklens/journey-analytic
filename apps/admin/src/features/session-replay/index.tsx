import {Search} from "@admin/components/search.tsx";
import {ThemeSwitch} from "@admin/components/theme-switch.tsx";
import {ProfileDropdown} from "@admin/components/profile-dropdown.tsx";
import {Header} from "@admin/components/layout/header.tsx";
import {Main} from '@admin/components/layout/main'
import {useEventSessionQuery} from "@admin/api/event/event-session-query.ts";
import {useEffect} from "react";
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

export default function SessionReplay() {
    const sessions = useEventSessionQuery();

    useEffect(() => {
        if (sessions.isSuccess) {
            console.log(sessions.data)
            let allEvents: any[] = [];
            sessions.data.forEach((row) => {
                allEvents = allEvents.concat(JSON.parse(row.events));
            });
            const replayer = new rrwebPlayer({
                target: document.getElementById('replay-container'), // customizable root element
                props: {
                    events: allEvents,
                },
            });

            replayer.play();
        }
    }, [sessions.isSuccess]);
    return (
        <div>
            <Header fixed>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                <div id={'replay-container'}></div>
            </Main>
        </div>
    )
}