import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import {evaluateSkateStatusRecord,nextChicagoDayStart,msUntilNextChicagoDay,type SkateStatusRecord} from '../client/src/lib/skateStatus.ts';
import {createSkateStatusSsr,SkateStatusSsrArtifactError} from '../server/skateStatusSsr.ts';
const record:SkateStatusRecord={state:'altered',note:'Academy only',updated:'2026-10-01',covered_from:'2026-09-28',covered_through:'2026-10-03',source_url:'https://example.com/academy'};
for(const [instant,current] of [['2026-10-04T04:59:59.999Z',true],['2026-10-04T05:00:00Z',false],['2026-10-01T04:59:59Z',false],['2026-10-01T05:00:00Z',true]] as const)test('Covered date '+instant,()=>assert.equal(evaluateSkateStatusRecord('rink',record,new Date(instant))?.isCurrent,current));
for(const [instant,next] of [['2026-03-08T06:00:00Z','2026-03-09T05:00:00Z'],['2026-11-01T05:00:00Z','2026-11-02T06:00:00Z'],['2026-10-04T04:59:59.999Z','2026-10-04T05:00:00Z']] as const)test('Chicago midnight '+instant,()=>{assert.equal(nextChicagoDayStart(new Date(instant))?.toISOString(),new Date(next).toISOString());assert.equal(msUntilNextChicagoDay(new Date(instant)),Date.parse(next)-Date.parse(instant)+250);});
for(const [name,override] of Object.entries({legacy:{covered_from:undefined},impossible:{covered_through:'2026-02-31'},reverse:{covered_from:'2026-10-04'},futureUpdated:{updated:'2026-10-02'},futureCoverage:{covered_from:'2026-10-02'},badState:{state:'maybe'},badUpdated:{updated:'soon'},stale:{updated:'2026-09-01'}}))test('Neutral '+name,()=>assert.equal(evaluateSkateStatusRecord('rink',{...record,...override},new Date('2026-10-01T12:00:00Z'))?.isCurrent,false));
test('Invalid clock',()=>assert.equal(evaluateSkateStatusRecord('rink',record,new Date(NaN))?.isCurrent,false));
function fixture(){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'isi-status-'));const ssr=path.join(dir,'ssr');fs.mkdirSync(ssr);fs.writeFileSync(path.join(dir,'package.json'),'{"type":"module"}');fs.writeFileSync(path.join(ssr,'status-routes.json'),'["/rink/example"]');fs.writeFileSync(path.join(ssr,'template.html'),'<!doctype html><html><head></head><body><div id="root"></div></body></html>');fs.writeFileSync(path.join(ssr,'entry-ssr.js'),'export function render(){return {html:"<p>Fresh status</p>",head:{title:"test"}}}');return {dir,ssr};}
async function withServer(handler:any,run:(url:string)=>Promise<void>){const app=express();app.use(handler);app.use((_req,res)=>res.status(200).send('STALE FALLBACK'));const s=app.listen(0,'127.0.0.1');await new Promise<void>(r=>s.once('listening',r));const a=s.address();assert.ok(a&&typeof a==='object');try{await run('http://127.0.0.1:'+a.port);}finally{await new Promise<void>((r,j)=>s.close(e=>e?j(e):r()));}}
for(const [name,change] of Object.entries({missingBundle:(f:any)=>fs.unlinkSync(path.join(f.ssr,'entry-ssr.js')),legacy:(f:any)=>{fs.unlinkSync(path.join(f.ssr,'template.html'));fs.unlinkSync(path.join(f.ssr,'status-routes.json'));},partial:(f:any)=>fs.unlinkSync(path.join(f.ssr,'template.html')),badManifest:(f:any)=>fs.writeFileSync(path.join(f.ssr,'status-routes.json'),'null'),invalidJson:(f:any)=>fs.writeFileSync(path.join(f.ssr,'status-routes.json'),'{broken'),missingRoot:(f:any)=>fs.writeFileSync(path.join(f.ssr,'template.html'),'<head></head>OLD NOTICE'),duplicateRoot:(f:any)=>fs.writeFileSync(path.join(f.ssr,'template.html'),'<head></head><div id="root"></div><div id="root"></div>'),invalidRenderer:(f:any)=>fs.writeFileSync(path.join(f.ssr,'entry-ssr.js'),'export const x=1;')}))test('Fail closed '+name,async()=>{const f=fixture();try{change(f);await assert.rejects(createSkateStatusSsr({distDir:f.dir}),SkateStatusSsrArtifactError);}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
test('Failed render503 never stale fallback',async()=>{const f=fixture();fs.writeFileSync(path.join(f.ssr,'entry-ssr.js'),'export function render(){throw new Error("fixture failed")}');try{await withServer(await createSkateStatusSsr({distDir:f.dir}),async url=>{const res=await fetch(url+'/rink/example');assert.equal(res.status,503);assert.equal(res.headers.get('cache-control'),'no-store');assert.ok(!(await res.text()).includes('STALE FALLBACK'));assert.equal((await fetch(url+'/other')).status,200);});}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
test('Aliases redirect before static serving',async()=>{const f=fixture();try{await withServer(await createSkateStatusSsr({distDir:f.dir}),async url=>{for(const alias of ['/rink/example/','/rink/example/index.html','/rink/example/%69ndex.html']){const res=await fetch(url+alias+'?keep=1',{redirect:'manual'});assert.equal(res.status,301);assert.equal(res.headers.get('location'),'/rink/example?keep=1');}assert.ok((await(await fetch(url+'/rink/example')).text()).includes('Fresh status'));});}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
// Read authored dates and wording so each weekly intake exercises the same build.
test('Built HTML activates and expires authored notices without rebuilding', async () => {
  const records = JSON.parse(fs.readFileSync('client/src/data/skate-status.json', 'utf8')) as Record<string, SkateStatusRecord>;
  const routes = JSON.parse(fs.readFileSync('dist/ssr/status-routes.json', 'utf8')) as string[];
  let now = new Date();
  await withServer(await createSkateStatusSsr({distDir: path.resolve('dist'), now: () => now}), async url => {
    for (const [slug, advisory] of Object.entries(records)) {
      assert.ok(advisory.covered_from && advisory.covered_through);
      // UTC midnight is the previous Chicago evening; its next midnight starts
      // coverage. UTC noon is on the covered day; its next midnight ends it.
      const starts = nextChicagoDayStart(new Date(advisory.covered_from + 'T00:00:00Z'))!;
      const expires = nextChicagoDayStart(new Date(advisory.covered_through + 'T12:00:00Z'))!;
      let baselineReview: unknown;
      let baselineModified: unknown;
      for (const [instant, current] of [
        [new Date(starts.getTime() - 1), false], [starts, true],
        [new Date(expires.getTime() - 1), true], [expires, false],
      ] as const) {
        now = instant;
        const response = await fetch(url + '/rink/' + slug);
        assert.equal(response.status, 200);
        const html = await response.text();
        assert.equal(html.includes('id="skate-status-' + slug + '"'), current, instant.toISOString());
        assert.equal(html.includes(advisory.note), current);
        assert.ok(html.includes(advisory.source_url));
        const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
          .flatMap(match => { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; });
        const web = schemas.find(value => value['@type'] === 'WebPage');
        const faq = schemas.find(value => value['@type'] === 'FAQPage');
        assert.ok(web && faq);
        assert.equal(JSON.stringify(faq).includes(advisory.note), current);
        if (instant < starts) { baselineReview = web.lastReviewed; baselineModified = web.dateModified; }
        assert.equal(web.lastReviewed, baselineReview, 'Notice must not change the whole-page review date');
        if (!current) assert.equal(web.dateModified, baselineModified, 'Inactive notice date must leave schema');
      }
      now = expires;
      for (const route of routes) {
        const response = await fetch(url + route);
        assert.equal(response.status, 200);
        assert.ok(!(await response.text()).includes(advisory.note), route);
      }
    }
  });
});

// A stable fixture protects the approved boundary independently of next week's data.
test('October 25 Chicago expiry includes the whole October 24 covered date', () => {
  const advisory = {...record, updated: '2026-10-18', covered_from: '2026-10-19', covered_through: '2026-10-24'};
  assert.equal(evaluateSkateStatusRecord('rink', advisory, new Date('2026-10-25T04:59:59.999Z'))?.isCurrent, true);
  const expired = evaluateSkateStatusRecord('rink', advisory, new Date('2026-10-25T05:00:00Z'));
  assert.equal(expired?.isCurrent, false);
  assert.equal(expired?.neutralReason, 'expired-coverage');
});

test('Fall DST repeated hours do not expire a covered date early', () => {
  const advisory = {...record, updated: '2026-10-31', covered_from: '2026-10-31', covered_through: '2026-11-01'};
  for (const instant of ['2026-11-01T06:30:00Z', '2026-11-01T07:30:00Z', '2026-11-02T05:59:59.999Z']) {
    assert.equal(evaluateSkateStatusRecord('rink', advisory, new Date(instant))?.isCurrent, true);
  }
  assert.equal(evaluateSkateStatusRecord('rink', advisory, new Date('2026-11-02T06:00:00Z'))?.isCurrent, false);
});
