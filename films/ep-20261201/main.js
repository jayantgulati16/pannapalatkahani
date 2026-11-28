// Entry: renders the film. ?t0=&t1= renders only that slice (the 3D page grows in memory, so long renders go in chunks)
import { makeComp } from './gl.js';
import { BOIL } from './crayon.js';
const Q = new URLSearchParams(location.search);
const comp = makeComp(document.getElementById('gl'));
await Promise.all(['400 40px Kalam', '700 40px Kalam'].map(f => document.fonts.load(f, 'अआ बारिश ab')));
const M = await import('./film.js');
const T0 = +(Q.get('t0') ?? 0), T1 = +(Q.get('t1') ?? M.DUR);
window.DUR = T1 - T0; window.EV = M.EV; window.TEXTS = t => M.TEXTS(t + T0);
const test = Q.get('test');
window.render = t => { t += T0; BOIL.step = Math.floor(t * 12 + 1e-6); test ? M.testFrame(comp, t, test) : M.frame(comp, t); };
window.READY = true;
