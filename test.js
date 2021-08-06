/** Quick test program for creating a FAT16 filesystem with a main.py file */
const createFatFS = require('./dist/oofatfs-node');
const debug = false;

const BLOCK_COUNT = 1024;
const BLOCK_SIZE = 4096;

const FM_FAT = 0x01;
const FM_FAT32 = 0x02;
const FM_EXFAT = 0x04;
const FM_ANY = 0x07;
const FM_SFD = 0x08;

const CTRL_SYNC = 0; /* Complete pending write process (needed at FF_FS_READONLY == 0) */
const GET_SECTOR_COUNT = 1; /* Get media size (needed at FF_USE_MKFS == 1) */
const GET_SECTOR_SIZE = 2; /* Get sector size (needed at FF_MAX_SS != FF_MIN_SS) */
const GET_BLOCK_SIZE = 3; /* Get erase block size (needed at FF_USE_MKFS == 1) */
const CTRL_TRIM = 4; /* Inform device that the data on the block of sectors is no longer used (needed at FF_USE_TRIM == 1) */
const IOCTL_INIT = 5;
const IOCTL_STATUS = 6;

const flash = new Uint8Array(BLOCK_COUNT * BLOCK_SIZE);

(async function () {
  const fatfs = await createFatFS({
    disk_ioctl: (bdev, cmd, buf) => {
      if (debug) {
        console.log('ioctl', cmd);
      }
      switch (cmd) {
        case CTRL_SYNC:
          break;
        case GET_SECTOR_COUNT:
          fatfs.HEAPU32[buf >> 2] = BLOCK_COUNT;
          break;
        case GET_SECTOR_SIZE:
          fatfs.HEAPU32[buf >> 2] = BLOCK_SIZE;
          break;
        case GET_BLOCK_SIZE:
          fatfs.HEAPU32[buf >> 2] = 1;
          break;
        case IOCTL_INIT:
          fatfs.HEAPU8[buf] = 0;
          break;
        case IOCTL_STATUS:
          fatfs.HEAPU8[buf] = 0;
          break;
      }
      return 0;
    },
    disk_read: (bdev, buf, sector, count) => {
      const start = sector * BLOCK_SIZE;
      const size = count * BLOCK_SIZE;
      fatfs.HEAPU8.set(flash.subarray(start, start + size), buf);
      return 0;
    },
    disk_write: (bdev, buf, sector, count) => {
      const start = sector * BLOCK_SIZE;
      const size = count * BLOCK_SIZE;
      if (debug) {
        console.log('write', start, fatfs.HEAPU8.subarray(buf, buf + size));
      }
      flash.set(fatfs.HEAPU8.subarray(buf, buf + size), start);
      return 0;
    },
  });

  const writeFile = fatfs.cwrap(
    'fatfs_write_file',
    ['number'],
    ['number', 'string', 'string', 'number']
  );

  const fs = fatfs._new_fatfs();
  const buf = fatfs._malloc(512);
  console.log('return code of 0 means ok!');
  console.log('mkfs:', fatfs._f_mkfs(fs, FM_FAT | FM_SFD, 0, buf, 512));
  console.log('mount:', fatfs._f_mount(fs));
  fatfs._free(buf);
  const fileData = 'hello world\n';
  console.log('writeFile:', writeFile(fs, 'main.py', fileData, fileData.length));
  console.log('umount:', fatfs._f_umount(fs));
  fatfs._free(fs);
})();
