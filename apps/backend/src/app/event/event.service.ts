import {Injectable, OnModuleInit} from '@nestjs/common';
import maxmind, {CityResponse, Reader} from 'maxmind';
import * as path from "node:path";

@Injectable()
export class EventService implements OnModuleInit {
    private lookupGeo: Reader<CityResponse> | undefined = undefined;
    constructor() {

    }

    async onModuleInit() {
        this.lookupGeo = await maxmind.open<CityResponse>(path.join(__dirname, 'assets', 'GeoLite2-Country.mmdb'));
    }

    async collectEventFromCustomer(ip: string) {
        console.log(ip)
        return this.lookupGeo?.get(ip);
    }
}
