#ifndef PHP_MEDIATRIX_H
#define PHP_MEDIATRIX_H

#define PHP_MEDIATRIX_EXTNAME  "mediatrix"
#define PHP_MEDIATRIX_EXTVER   "0.1"

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif 

extern "C" {
#include "php.h"
}

extern zend_module_entry mediatrix_module_entry;
#define phpext_mediatrix_ptr &mediatrix_module_entry;

#endif /* PHP_VEHICLES_H */
