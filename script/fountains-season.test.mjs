import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=async route=>readFile(new URL('../dist/public/'+route+'/index.html',import.meta.url),'utf8');
const schemas=body=>[...body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
test('Fountains rendered facts agree across essentials, About and metadata',async()=>{
 const body=await html('rink/fountains-at-gateway-murfreesboro-tn');
 assert.match(body,/November 20, 2026 through January 31, 2027/);
 assert.match(body,/120 minutes/);assert.match(body,/\$20/);assert.match(body,/\$15/);
 assert.match(body,/ages 3 and under with a paid adult/);
 assert.match(body,/Included with public-skate admission/);
 assert.match(body,/pay at the gate/i);
 assert.doesNotMatch(body,/60.minute|2025.{0,3}26 season|opening date is unconfirmed|terms unconfirmed/);
 assert.match(body,/<meta name="description" content="[^"]*120 minutes/);
 assert.match(body,/href="https:\/\/fountainswinterfest.com\/"/);
 const web=schemas(body).find(s=>s['@type']==='WebPage');
 assert.equal(web.dateModified,'2026-11-06');assert.equal(web.lastReviewed,'2026-05-23');
});
test('Nashville table and FAQ publish current Fountains season without confirming Smashville',async()=>{
 const body=await html('city/tn/nashville');
 const row=body.match(/<tr[^>]*>(?:(?!<\/tr>)[\s\S])*?Fountains at Gateway(?:(?!<\/tr>)[\s\S])*?<\/tr>/)?.[0];
 assert.ok(row);assert.match(row,/\$20 ages 13\+/);assert.match(row,/\$15 ages 4/);assert.match(row,/Jan 31, 2027/);assert.match(row,/Pay at gate/);assert.doesNotMatch(row,/\$12|\$17|Nov.{0,10}Feb/);
 const faq=schemas(body).find(s=>s['@type']==='FAQPage');assert.match(JSON.stringify(faq),/Fountains runs November 20, 2026 through January 31, 2027/);
 assert.match(body,/Smashville skating remains unconfirmed/);
 assert.equal(schemas(body).find(s=>s['@type']==='WebPage').dateModified,'2026-11-07');
});
for(const slug of ['public-skating-nashville','indoor-ice-skating-nashville','ice-skating-nashville-kids'])test('Existing seasonal reference is current: '+slug,async()=>{
 const body=await html('blog/'+slug);assert.match(body,/Fountains Winterfest has announced November 20, 2026 through January 31, 2027/);assert.doesNotMatch(body,/Fountains skating seasons are unconfirmed|upcoming Fountains and Smashville/);
 const article=schemas(body).find(s=>s['@type']==='Article'||s['@type']==='BlogPosting');assert.ok(article);assert.equal(article.dateModified,'2026-11-06');
});
