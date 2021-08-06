/*
 oofatfs 0.0.1 

 Copyright (C) 2021, Uri Shaked
*/

export default function createFatFS(options: {
  locateFile?: (string) => string;
  disk_ioctl?: (bdev: number, cmd: number, buf: number) => number;
  disk_read?: (bdev: number, buf: number, sector: number, count: number) => number;
  disk_write?: (bdev: number, buf: number, sector: number, count: number) => number;
  get_fattime?: () => number;
}): Promise<any>;
