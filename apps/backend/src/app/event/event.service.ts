import {Injectable, OnModuleInit} from '@nestjs/common';
import maxmind, {CityResponse, Reader} from 'maxmind';

@Injectable()
export class EventService implements OnModuleInit {
    private lookupGeo: Reader<CityResponse> | undefined = undefined;
    constructor() {

    }

    async onModuleInit() {
        this.lookupGeo = await maxmind.open<CityResponse>('../../assets/GeoLite2-City.mmdb');
    }

    async collectEventFromCustomer() {

    }
}
