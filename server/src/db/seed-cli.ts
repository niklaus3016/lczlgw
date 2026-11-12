/** 手动执行种子导入：npm run seed（数据库为空时才会写入） */
import { ensureTables } from './index.js';
import { needsSeed, runSeed } from './seed.js';

ensureTables();
if (needsSeed()) {
  runSeed();
} else {
  console.log('[seed] 数据库已有数据，跳过导入');
}
