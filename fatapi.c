/**
 * A bunch of helper methods / glue code for using oofatfs from JavaScript
 */

#include <stdlib.h>
#include "ff.h"

FATFS *new_fatfs()
{
  return malloc(sizeof(FATFS));
}

UINT fatfs_write_file(FATFS *fs, char *name, void *data, UINT size)
{
  UINT result;
  FIL file;
  result = f_open(fs, &file, name, FA_WRITE | FA_CREATE_ALWAYS);
  if (result != FR_OK) {
    return result;
  }
  result = f_write(&file, data, size, &result);
  if (result != FR_OK) {
    return result;
  }
  result = f_close(&file);
  return result;
}
