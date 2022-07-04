# ooFatFs Web Assembly Makefile
# Make sure you have EMScripten SDK (emsdk) installed in your path:
# https://emscripten.org/docs/getting_started/downloads.html#installation-instructions-using-the-emsdk-recommended

CC=emcc
SOURCES=fatapi.c oofatfs/src/ff.c oofatfs/src/ffsystem.c oofatfs/src/ffunicode.c
EXPORTS=_new_fatfs,_fatfs_write_file,_disk_read,_disk_ioctl,_disk_write,_get_fattime,_malloc,_free,_f_open,_f_close,_f_read,_f_write,_f_lseek,_f_truncate,_f_sync,_f_opendir,_f_closedir,_f_readdir,_f_mkdir,_f_unlink,_f_rename,_f_stat,_f_chmod,_f_utime,_f_getfree,_f_getlabel,_f_setlabel,_f_mount,_f_umount,_f_mkfs
CFLAGS = -s MODULARIZE=1 -s 'EXPORT_NAME="oofatfs"'  -Ioofatfs/src -I. -DFFCONF_H=\"ffconf_wasm.h\" \
	-s 'EXPORTED_FUNCTIONS=$(EXPORTS)' --js-library library.js \
	-s EXPORTED_RUNTIME_METHODS="['cwrap']" -s ALLOW_TABLE_GROWTH=1 -s ASSERTIONS=0 \

all: dist/oofatfs.js dist/oofatfs-node.js

dist/oofatfs.js: $(SOURCES) | dist patch
	$(CC) -o $@ $(CFLAGS) -s EXPORT_ES6=1 -s ENVIRONMENT=web $^

dist/oofatfs-node.js: $(SOURCES) | dist patch
	$(CC) -o $@ $(CFLAGS) $^

dist: 
	mkdir $@
	cp oofatfs/LICENSE $@

patch:
	git apply --reverse --check oofatfs.patch 2>/dev/null || git apply oofatfs.patch

clean:
	rm -rf dist
