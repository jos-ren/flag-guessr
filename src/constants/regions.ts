import type { RegionFilter } from '@/types';

export const COUNTRY_REGIONS: Record<string, RegionFilter> = {
  // Africa
  dz: 'africa', ao: 'africa', bj: 'africa', bw: 'africa', bf: 'africa',
  bi: 'africa', cm: 'africa', cv: 'africa', cf: 'africa', td: 'africa',
  km: 'africa', cg: 'africa', cd: 'africa', ci: 'africa', dj: 'africa',
  eg: 'africa', gq: 'africa', er: 'africa', sz: 'africa', et: 'africa',
  ga: 'africa', gm: 'africa', gh: 'africa', gn: 'africa', gw: 'africa',
  ke: 'africa', ls: 'africa', lr: 'africa', ly: 'africa', mg: 'africa',
  mw: 'africa', ml: 'africa', mr: 'africa', mu: 'africa', ma: 'africa',
  mz: 'africa', na: 'africa', ne: 'africa', ng: 'africa', rw: 'africa',
  st: 'africa', sn: 'africa', sc: 'africa', sl: 'africa', so: 'africa',
  za: 'africa', ss: 'africa', sd: 'africa', tz: 'africa', tg: 'africa',
  tn: 'africa', ug: 'africa', zm: 'africa', zw: 'africa',
  // Americas
  ag: 'americas', ar: 'americas', bs: 'americas', bb: 'americas',
  bz: 'americas', bo: 'americas', br: 'americas', ca: 'americas',
  cl: 'americas', co: 'americas', cr: 'americas', cu: 'americas',
  dm: 'americas', do: 'americas', ec: 'americas', sv: 'americas',
  gd: 'americas', gt: 'americas', gy: 'americas', ht: 'americas',
  hn: 'americas', jm: 'americas', mx: 'americas', ni: 'americas',
  pa: 'americas', py: 'americas', pe: 'americas', kn: 'americas',
  lc: 'americas', vc: 'americas', sr: 'americas', tt: 'americas',
  us: 'americas', uy: 'americas', ve: 'americas',
  // Asia
  af: 'asia', am: 'asia', az: 'asia', bd: 'asia', bt: 'asia',
  bn: 'asia', kh: 'asia', cn: 'asia', ge: 'asia', in: 'asia',
  id: 'asia', jp: 'asia', kz: 'asia', kg: 'asia', kp: 'asia',
  kr: 'asia', la: 'asia', my: 'asia', mv: 'asia', mn: 'asia',
  mm: 'asia', np: 'asia', pk: 'asia', ph: 'asia', sg: 'asia',
  lk: 'asia', tw: 'asia', tj: 'asia', th: 'asia', tl: 'asia',
  tm: 'asia', uz: 'asia', vn: 'asia',
  // Europe
  al: 'europe', ad: 'europe', at: 'europe', by: 'europe', be: 'europe',
  ba: 'europe', bg: 'europe', hr: 'europe', cy: 'europe', cz: 'europe',
  dk: 'europe', ee: 'europe', fi: 'europe', fr: 'europe', de: 'europe',
  gr: 'europe', hu: 'europe', is: 'europe', ie: 'europe', it: 'europe',
  xk: 'europe', lv: 'europe', li: 'europe', lt: 'europe', lu: 'europe',
  mt: 'europe', md: 'europe', mc: 'europe', me: 'europe', nl: 'europe',
  mk: 'europe', no: 'europe', pl: 'europe', pt: 'europe', ro: 'europe',
  ru: 'europe', sm: 'europe', rs: 'europe', sk: 'europe', si: 'europe',
  es: 'europe', se: 'europe', ch: 'europe', ua: 'europe', gb: 'europe',
  va: 'europe', tr: 'europe',
  // Middle East
  bh: 'middle-east', ir: 'middle-east', iq: 'middle-east', il: 'middle-east',
  jo: 'middle-east', kw: 'middle-east', lb: 'middle-east', om: 'middle-east',
  ps: 'middle-east', qa: 'middle-east', sa: 'middle-east', sy: 'middle-east',
  ae: 'middle-east', ye: 'middle-east',
  // Oceania
  au: 'oceania', fj: 'oceania', ki: 'oceania', mh: 'oceania',
  fm: 'oceania', nr: 'oceania', nz: 'oceania', pw: 'oceania',
  pg: 'oceania', ws: 'oceania', sb: 'oceania', to: 'oceania',
  tv: 'oceania', vu: 'oceania',
};

export const REGION_LABELS: Record<RegionFilter, string> = {
  all: 'All regions',
  africa: 'Africa',
  americas: 'Americas',
  asia: 'Asia',
  europe: 'Europe',
  'middle-east': 'Middle East',
  oceania: 'Oceania',
};
