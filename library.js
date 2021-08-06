mergeInto(LibraryManager.library, {
  disk_ioctl: function (...args) {
    return Module.disk_ioctl ? Module.disk_ioctl(...args) : -1;
  },
  disk_read: function (...args) {
    return Module.disk_read ? Module.disk_read(...args) : -1;
  },
  disk_write: function (...args) {
    return Module.disk_write ? Module.disk_write(...args) : -1;
  },
  get_fattime: function (...args) {
    return Module.get_fattime ? Module.get_fattime(...args) : 0;
  },
});
