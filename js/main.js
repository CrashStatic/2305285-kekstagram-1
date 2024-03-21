import './data.js';
import { generatePhotos } from './data.js';
import './miniatures.js';
import { renderMiniatures } from './miniatures.js';

const photos = generatePhotos();

renderMiniatures(photos);
