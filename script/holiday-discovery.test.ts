import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import {holidayDiscoveryActive} from '../client/src/lib/holidayDiscovery.ts';
import {createSkateStatusSsr} from '../server/skateStatusSsr.ts';
const routes=['/','/state/tn','/city/tn/nashville','/rink/centennial-sportsplex-nashville-tn','/rink/ford-ice-center-bellevue-nashville-tn'];
const {render}=await import(path.resolve('dist/ssr/entry-ssr.js'));
// Assert authored seasonal copy at a fixed in-season date. A legitimate build
// after expiry must not make this regression test fail.
const read=(route:string)=>routes.includes(route) ? render(route,{asOf:new Date('2026-11-10T18:00:00Z')}).html : fs.readFileSync(path.join('dist/public',route,'index.html'),'utf8');
for(const [value,expected] of [['2026-11-10T05:59:59.999Z',false],['2026-11-10T06:00:00Z',true],['2027-02-01T05:59:59.999Z',true],['2027-02-01T06:00:00Z',false],['not-a-date',false]] as const)test('Holiday promotion date boundary '+value,()=>assert.equal(holidayDiscoveryActive(new Date(value)),expected));
test('All dated-discovery consumers use request-time HTML and preserve the original manifest',()=>{
 const now=JSON.parse(fs.readFileSync('dist/ssr/status-routes.json','utf8'));
 for(const route of routes)assert.ok(now.includes(route),route);
 assert.equal(now.length,11);
});
test('Authored copy is server visible with preserved anchors and factual qualifications',()=>{
 for(const route of ['/','/state/tn']){const h=read(route);assert.match(h,/id="holiday-rinks"/);assert.match(h,/event dates are not skating dates/);assert.match(h,/rental inclusion is not verified/);assert.match(h,/120 minutes/);assert.match(h,/href="\/blog\/ice-skating-cost-nashville#holiday-rinks"/);}
 const hub=read('/city/tn/nashville');assert.ok(hub.indexOf('id="at-a-glance"')<hub.indexOf('id="seasonal"'));assert.ok(hub.indexOf('id="seasonal"')<hub.indexOf('id="centennial"'));assert.equal((hub.match(/id="seasonal"/g)||[]).length,1);
 for(const id of ['at-a-glance','centennial','bellevue','antioch','clarksville','gary-force','seasonal','choose','learn-to-skate','freestyle','tips','guides','faq'])assert.ok(hub.includes(`id="${id}"`));
 for(const route of routes.slice(3))assert.match(read(route),/data-testid="holiday-comparison-link"/);
 assert.doesNotMatch(read('/rink/ford-ice-center-antioch-antioch-tn'),/data-testid="holiday-comparison-link"/);
 const post=read('/blog/ice-skating-cost-nashville');assert.match(post,/id="holiday-rinks"/);assert.match(post,/holiday rink comparison added/);assert.match(post,/Other sections keep their own check dates/);assert.match(post,/"dateModified":"2026-11-08"/);assert.doesNotMatch(read('/blog/how-much-does-ice-skating-cost'),/article-update-note/);
});
test('Promotions expire in initial HTTP HTML without rebuild while evergreen content and anchor survive',async()=>{
 let now=new Date('2027-02-01T05:59:59.999Z');
 const app=express();app.use(await createSkateStatusSsr({distDir:path.resolve('dist'),now:()=>now}));app.use((_q,r)=>r.status(599).send('STALE FALLBACK'));
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));const a=server.address();assert.ok(a&&typeof a==='object');const base='http://127.0.0.1:'+a.port;
 try{for(const before of [true,false]){now=new Date(before?'2027-02-01T05:59:59.999Z':'2027-02-01T06:00:00Z');for(const route of routes){const r=await fetch(base+route);const h=await r.text();assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-cache');const marker=route.startsWith('/rink/')?'data-testid="holiday-comparison-link"':route==='/city/tn/nashville'?'Operator pages checked November 10, 2026':'id="holiday-rinks"';assert.equal(h.includes(marker),before,route);if(route==='/'){assert.equal(h.includes('plus what each Nashville-area holiday rink ticket covers'),before);}if(route==='/city/tn/nashville'){assert.equal((h.match(/id="seasonal"/g)||[]).length,1);if(!before)assert.ok(h.indexOf('id="gary-force"')<h.indexOf('id="seasonal"'));}}}}finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
