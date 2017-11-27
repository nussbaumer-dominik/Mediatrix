#include "php_mediatrix.h"

PHP_MINIT_FUNCTION(mediatrix)
{
    return SUCCESS;
}

zend_module_entry mediatrix_module_entry = {
#if ZEND_MODULE_API_NO >= 20010901
    STANDARD_MODULE_HEADER,
#endif
    PHP_MEDIATRIX_EXTNAME,
    NULL,                  /* Functions */
    PHP_MINIT(mediatrix),
    NULL,                  /* MSHUTDOWN */
    NULL,                  /* RINIT */
    NULL,                  /* RSHUTDOWN */
    NULL,                  /* MINFO */
#if ZEND_MODULE_API_NO >= 20010901
    PHP_MEDIATRIX_EXTVER,
#endif
    STANDARD_MODULE_PROPERTIES
};

#ifdef COMPILE_DL_MEDIATRIX
extern "C" {
ZEND_GET_MODULE(mediatrix)
}
#endif
