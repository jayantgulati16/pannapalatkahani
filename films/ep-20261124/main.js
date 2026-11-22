// Entry: renders the film; ?test=model draws a model sheet
import { makeComp } from './gl.js';
import { BOIL } from './crayon.js';
const Q = new URLSearchParams(location.search);
const comp = makeComp(document.getElementById('gl'));
await Promise.all(['400 40px Kalam', '700 40px Kalam'].map(f => document.fonts.load(f, 'अआ बारिश ab')));
const M = await import('./film.js');
window.DUR = M.DUR; window.EV = M.EV; window.TEXTS = M.TEXTS;
const test = Q.get('test');
window.render = t => { BOIL.step = Math.floor(t * 12 + 1e-6); test ? M.testFrame(comp, t, test) : M.frame(comp, t); };
window.READY = true;
