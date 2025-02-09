import {Inject, Injectable, OnModuleDestroy} from '@nestjs/common';
import {BloomFilter} from 'bloom-filters';
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";
import {BloomFilterVisitorRepository} from "../../repositories/maria";

@Injectable()
export class BloomService implements OnModuleDestroy {
    private bloomFilters: Map<string, BloomFilter>;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly bloomFilterVisitorRepository: BloomFilterVisitorRepository
    ) {
        this.bloomFilters = new Map();

        // Định kỳ ghi Bloom Filter vào MySQL mỗi 5 phút
        setInterval(() => this.saveAllToDatabase(), 5 * 60 * 1000);
    }

    async saveAllToDatabase() {
        console.log('💾 Lưu tất cả Bloom Filters vào MySQL...');
        for (const [siteId, filter] of this.bloomFilters.entries()) {
            await this.bloomFilterVisitorRepository.save({
                websiteId: siteId,
                filerData: filter.saveAsJSON()
            })
        }
    }

    async onModuleDestroy() {
        await this.saveAllToDatabase();
    }

    async getOrCreateBloomFilter(siteId: string): Promise<BloomFilter | undefined> {
        if (!this.bloomFilters.has(siteId)) {
            // Kiểm tra Redis trước
            const redisData = await this.cacheManager.get<string>(`bloom:${siteId}`);
            if (redisData) {
                console.log(`⚡ Load Bloom Filter từ Redis cho site: ${siteId}`);
                this.bloomFilters.set(siteId, BloomFilter.fromJSON(JSON.parse(redisData)));
            } else {
                // Nếu Redis không có, tải từ MySQL
                console.log(`🔄 Load Bloom Filter từ MySQL cho site: ${siteId}`);
                const siteBloom = await this.bloomFilterVisitorRepository.findOneBy({
                    websiteId: siteId,
                });

                if (siteBloom) {
                    this.bloomFilters.set(siteId, BloomFilter.fromJSON(JSON.parse(siteBloom.filerData)));
                } else {
                    this.bloomFilters.set(siteId, new BloomFilter(1e8, 0.01));
                }
                // Cache lại vào Redis
                // cache 5 minutes
                await this.cacheManager.set(`bloom:${siteId}`, JSON.stringify(this.bloomFilters?.get(siteId)?.saveAsJSON()), 1000 * 60 * 5);
            }
        }
        return this.bloomFilters.get(siteId);
    }

    async hasVisitor(siteId: string, visitorId: string): Promise<boolean> {
        const bloomFilter = await this.getOrCreateBloomFilter(siteId);
        return !!bloomFilter && bloomFilter.has(visitorId);
    }

    async addVisitor(siteId: string, visitorId: string) {
        const bloomFilter = await this.getOrCreateBloomFilter(siteId);
        if (bloomFilter) {
            bloomFilter.add(visitorId);
            await this.cacheManager.set(`bloom:${siteId}`, JSON.stringify(bloomFilter.saveAsJSON()), 1000 * 60 * 5);
        }
    }
}
